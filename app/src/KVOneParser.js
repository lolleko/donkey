/**
 * Abstract parser class
 */
class KVOneParser {

  get langIdentifier () {
    return 'kv1'
  }

  parse (text) {
    return new VDFMap()
  }

  stringify (map) {
    var result = ''
    this.indent = 0
    this.keyValuePairIndent = 0
    this._stringify(map, result)
  }

  _stringify (map, result) {
    result = result + '\n' + this._tabs()
    for (var [k, v] of map) {
      if (v instanceof VDFMap) {
        result = result + this._stringifyParentKey(k)
        this.indent++
        result = result + this._stringify(v, result)
      } else if (v instanceof Array) {

      } else if (k.includes('DONKEYINTERNAL:COMMENT')) {
        result = result + this._stringifyComment(v)
      } else {
        result = result + this._stringifyKeyValuePair(k, v)
      }
    }
  }

  _stringifyKeyValuePair (k ,v) {
    return
  }

  _stringifyParentKey (k) {
    return '"' + k + '"\n' + this._tabs()
  }

  _stringifyArray (arr) {

  }

  _tabs (amount) {
    return //tab string
  }
}

module.exports = KVOneParser
