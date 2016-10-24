/**
 * Abstract parser class
 */
class Parser {

  get langIdentifier () {
    return 'AbstractParserOverwriteThis'
  }

  /**
   * [parse description]
   * @param  {string} text that should be converted to a VDFMap
   * @return {VDFMap} map representing the parsed data
   */
  parse (text) {
    return new VDFMap()
  }

  stringify (map) {
    return ''
  }
}

module.exports = Parser
