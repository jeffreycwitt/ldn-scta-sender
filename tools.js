var parse = require('parse-link-header');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');


module.exports = {
  inbox_from_header: function(target_url, source_url){
    //this conditional is temporary
    if (target_url.includes("http://scta.info/resource/")) {
      var inbox = "http://inbox.scta.info/notifications/?resourceid=" + target_url;
      module.exports.send_post(inbox, target_url, source_url);
    }
    else{
      // set some defaults
      req = request.defaults({
        	jar: true,                 // save cookies to jar
        	rejectUnauthorized: false,
        	followAllRedirects: true   // allow redirections
        });

        req.get({
          url: target_url
        }, function(err, resp, body) {

        // var linkHeader =
        //   '<https://api.github.com/user/9287/repos?page=3&per_page=100>; rel="next", ' +
        //   '<https://api.github.com/user/9287/repos?page=1&per_"prev"; pet="cat", '+
        //   '<https://api.github.com/user/9287/repos?page=5&per_page=100>; rel="last"'

        //var parsed = parse(linkHeader);
        var parsed = parse(resp.headers.link);
        var inbox = parsed["http://www.w3.org/ns/ldp#inbox"] ? parsed["http://www.w3.org/ns/ldp#inbox"].url : ""
        console.log(inbox);
        if (inbox === ""){
          module.exports.inbox_from_rdf(target_url, source_url);
        }
        else {
          module.exports.send_post(inbox, target_url, source_url);
        }



      });
    }
  },
  inbox_from_rdf: function(target_url, source_url){

    req.get({
        url: target_url
      }, function(err, resp, body) {
        // load the html into cheerio
    	var $ = cheerio.load(body);
      // get the data and output to console
      var inboxes = [];
  	   $("[rel]").each(function (i, elem){
  		    //console.log( 'properties found: ' + $(this).attr("href"));
  		      if ($(this).attr("rel") === ("ldp:inbox") ){
              inboxes.push($(this).attr("href"))
            };
        });
      var inbox = inboxes[0];
      module.exports.send_post(inbox, target_url, source_url);
      }
    );




  },
  send_post: function(inbox, target_url, source_url){

			var postdata = {
			  "@context": "http://www.w3.org/ns/anno.jsonld",
			  "id": "http://example.org/example1",
			  "type": "Annotation",
			  "motivation": "discussing",
			  "updated": "2017-03-10 01:34:24 UTC",
			  "body": {
			    "id": source_url,
			    "value": "Discussion of the is resource occurs here."
			  },
			  "target": target_url
			}

			// POST data then scrape the page
			request({
			    url: inbox,
			    method: "POST",
					json: postdata,
          headers: {
            'content-type': 'application/ld+json'
          }
        }, function(err, resp, body) {

				console.log("post-body", err)
				//console.log(resp)
			}
    );
	}

}
