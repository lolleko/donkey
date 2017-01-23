/**
 * Custom Parser for valves KV1 format.
 * In addition to data, comments will also be parsed for editing.
 * Inline comments are ignored.
 */
class KVOneParser extends Parser {

  constructor () {
    super()

    // We allow c++ like comments
    this.cCommentToken = '/'
    this.commentToken = '//'

    this.openingToken = '{'
    this.closingToken = '}'

    // The string token is a bit differen we dont actually search for 'str'.
    // 'str' is  a placeholder for any string that doesn't match the above tokens
    this.stringToken = 'str'
  }

  get langIdentifier () {
    return 'kv1'
  }

  parse (text) {
    this.text = text
    this.parserIndex = 0
    this.lastTabAmount = 0
    this.currentlineNumber = 1
    this.currentComment = ''
    this.lastKey = ''

    // Purge inline comments
    this.text = this.text.replace(/([^\/ \t\n\r])([ \t]*\/\/[^\n\r]+)/g, '$1')

    var result = new VDFMap()
    this._parse(result)
    return result
  }

  _parse (result) {
    var currentToken = this.nextToken()

    while (currentToken) {
      if (currentToken === this.commentToken) {
        // read the next line
        var comment = this.eatLine().trim()
        // If this is the first line of a comment
        if (!this.currentComment) {
          this.currentComment = comment
        } else {
          this.currentComment = this.currentComment + '\n' + comment
        }
      } else {
        // add comment
        if (this.currentComment) {
          result.set(donkey.files.getCommentMacro(), this.currentComment)
          this.currentComment = ''
        }

        if (currentToken === this.openingToken) {
          if (!this.lastKey) {
            throw SyntaxError('KV1 Parser Could not assign a key name to a parent block at line: ' + this.currentlineNumber)
          }
          // go deeper
          var key = this.lastKey
          this.lastKey = ''
          result.set(key, this._parse(new VDFMap()))
        } else if (currentToken === this.closingToken) {
          // one up
          return result
        } else if (currentToken === this.stringToken) {
          if (!this.lastKey) {
            this.lastKey = this.eatWord()
          } else {
            var value = this.eatWord()
            result.set(this.lastKey, value)
            this.lastKey = ''
          }
        }
      }
      currentToken = this.nextToken(this.text)
    }
  }

  nextToken () {
    this.eatWhitespace()

    if (this.parserIndex >= this.text.length) {
      return false
    }

    var c = this.text[this.parserIndex]
    if (c === this.cCommentToken) {
      if (c + this.text[this.parserIndex + 1] === this.commentToken) {
        this.parserIndex = this.parserIndex + 2
        return this.commentToken
      } else {
        // This will parse single slash comments,
        // even if valve doesnt allows this?
        this.parserIndex++
        // we wont make a special case for this,
        // as a c++ like comment can be parsed as c comment after this point.
        return this.commentToken
      }
    } else if (c === this.openingToken) {
      this.parserIndex++
      return this.openingToken
    } else if (c === this.closingToken) {
      this.parserIndex++
      return this.closingToken
    } else {
      return this.stringToken
    }
  }

  /**
   * Skip until the next non whitespace character is found
   */
  eatWhitespace () {
    while ('\n\r\t '.indexOf(this.text[this.parserIndex]) !== -1) {
      if (this.text[this.parserIndex] === '\n') {
        this.currentlineNumber++
      }
      this.parserIndex++
    }
  }

  /**
   * Read to the next newline and return the result
   * @return {String} the current line
   */
  eatLine () {
    var line = ''
    while (this.parserIndex < this.text.length && '\n\r'.indexOf(this.text[this.parserIndex]) === -1) {
      line = line + this.text[this.parserIndex]
      this.parserIndex++
    }

    return line
  }

  /**
   * Read the next word.
   * @return {String} the current word
   */
  eatWord () {
    var word = ''
    // if token is quoted eat til the next quote
    if (this.text[this.parserIndex] === '"') {
      // skip first quote
      this.parserIndex++
      while (this.parserIndex < this.text.length && this.text[this.parserIndex] !== '"') {
        word = word + this.text[this.parserIndex]
        this.parserIndex++
      }
      // skip last quote
      this.parserIndex++
    } else {
      while (this.parserIndex < this.text.length && '\n\r\t '.indexOf(this.text[this.parserIndex]) === -1) {
        word = word + this.text[this.parserIndex]
        this.parserIndex++
      }
    }
    return word
  }

  stringify (map) {
    var result = ''
    this.indent = 0
    this.keyValuePairIndent = 0
    this.lastTabAmount = 0
    return this._stringify(map, result).trim()
  }

  _stringify (map, result) {
    for (var [k, v] of map) {
      if (v instanceof VDFMap) {
        result = result + this._stringifyParentKey(k)
        this.indent++
        result = result + this._stringify(v, '')
        this.indent--
        result = result + '\n' + this._tabs() + '}'
      } else if (v instanceof Array) {

      } else if (k.includes(donkey.files.KVMACRO_COMMENT)) {
        result = result + this._stringifyComment(v)
      } else {
        result = result + this._stringifyKeyValuePair(k, v)
      }
    }
    return result
  }

  _stringifyComment (content) {
    var tabs = this._tabs()
    return '\n' + tabs + '// ' + content.replace(/\n/g, '\n' + tabs + '// ')
  }

  _stringifyKeyValuePair (k, v) {
    return '\n' + this._tabs() + '"' + k + '" "' + v + '"'
  }

  _stringifyParentKey (k) {
    return '\n' + this._tabs() + '"' + k + '"\n' + this._tabs() + '{'
  }

  _stringifyArray (arr) {

  }

  _tabs (amount) {
    // Calculate indention with caching
    if (this.lastTabAmount !== amount) {
      this.tabCache = this.tabChar.repeat(this.indent)
    }
    return this.tabCache
  }
}

module.exports = donkey.files.registerParser('kv1', KVOneParser)
