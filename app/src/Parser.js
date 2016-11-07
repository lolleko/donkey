/**
 * Abstract parser class
 */
class Parser {

  constructor () {
    this.tabChar = '\t'
  }

  detect (path) {
    return true
  }

  /**
   * Converts a string to a VDFMap.
   * @param  {String} text that should be converted to a VDFMap
   * @return {VDFMap} map representing the parsed data
   */
  parse (text) {
    return new VDFMap()
  }

  /**
   * Converts VDFMap to a string.
   * @param  {VDFMap} map representing the data.
   * @return {String} the string.
   */
  stringify (map) {
    return ''
  }
}

module.exports = Parser
