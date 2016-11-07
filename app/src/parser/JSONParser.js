/**
 * Abstract parser class
 */
class JSONParser extends Parser {

  get langIdentifier () {
    return 'json'
  }

  parse (text) {
    return new VDFMap()
  }

  stringify (map) {
    return ''
  }
}

module.exports = JSONParser
