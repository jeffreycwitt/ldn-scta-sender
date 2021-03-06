var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var tools = require('./tools');
// set some defaults
req = request.defaults({
	jar: true,                 // save cookies to jar
	rejectUnauthorized: false,
	followAllRedirects: true   // allow redirections
});

var url = process.argv[2];

req.get({
    url: url,
    headers: {
        'User-Agent': 'Super Cool Browser' // optional headers
     }
  }, function(err, resp, body) {
// load the html into cheerio
	var $ = cheerio.load(body);

	// get the data and output to console
	$("[property]").each(function (i, elem){
		//console.log( 'properties found: ' + $(this).attr("href"));
		if ($(this).attr("property").includes("cito:discusses") ){

			var parent = $(this).closest("[id]").attr("id");
			var source_url = url + "#" + parent
			console.log("parent found", parent)

			//var target_url = "https://linkedresearch.org/ldn/tests/target/3a2cb180-05b0-11e7-bd05-bf9fab02ee3c?discovery=link-header"
			//var target_url = "https://linkedresearch.org/ldn/tests/target/3a2cb180-05b0-11e7-bd05-bf9fab02ee3c?discovery=rdf-body"
			var target_url = $(this).attr("resource");
			console.log("target_url found", target_url);
			var inbox = tools.inbox_from_header(target_url, source_url)
		}
	});



	//console.log( 'Host: ' + $('.inner_cntent:nth-child(2) span').text() );
	//console.log( 'UA: ' + $('.browser span').text() );

});
