/**
 * Abstract parser class
 */
class KVThreeParser extends Parser {

  get langIdentifier () {
    return 'kv3'
  }

  parse (text) {
    return new VDFMap()
  }

  stringify (map) {
    return ''
  }
}

module.exports = KVThreeParser
