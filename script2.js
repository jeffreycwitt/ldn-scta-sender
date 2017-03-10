var RdfaParser = require('rdf-parser-rdfa')

RdfaParser.parse(document).then(function (graph) {
  console.log(graph.toString())
}).catch(function (error) {
  console.log(error)
})
