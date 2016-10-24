/**
 * Abstract parser class
 */
class JSONParser {

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
