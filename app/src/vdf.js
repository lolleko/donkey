/*
VDF (de)serialization
Copyright (c) 2010-2013, Anthony Garcia <anthony@lagg.me>
Distributed under the ISC License (see LICENSE)

Ported to node.js by Rob Jackson - rjackson.me.
*/

var util = require('util')

var STRING = '"'
var NODE_OPEN = '{'
var NODE_CLOSE = '}'
var BR_OPEN = '['
var BR_CLOSE = ']'
var COMMENT = '/'
var CR = '\r'
var LF = '\n'
var SPACE = ' '
var TAB = '\t'
var WHITESPACE = [SPACE, '\t', '\r', '\n']

function _symtostr (line, i, token) {
  token = token || STRING

  var opening = i + 1
  var closing = opening

  var ci = line.indexOf(token, opening)
  while (ci !== -1) {
    if (line.substring(ci - 1, ci) !== '\\') {
      closing = ci
      break
    }
    ci = line.indexOf(token, ci + 1)
  }

  var finalstr = line.substring(opening, closing)
  return [finalstr, i + finalstr.length + 1]
}

function _unquotedtostr (line, i) {
  var ci = i
  while (ci < line.length) {
    if (WHITESPACE.indexOf(line.substring(ci, ci + 1)) > -1) {
      break
    }
    ci += 1
  }
  return [line.substring(i, ci), ci]
}

function _parse (stream, ptr) {
  // if stream is invalid bail
  if (!stream) {
    return [new VDFMap()]
  }

  ptr = ptr || 0

  var laststr
  var lasttok
  var lastbrk
  var i = ptr
  var nextIsValue = false
  var deserialized = new VDFMap()

  while (i < stream.length) {
    var c = stream.substring(i, i + 1)

    var _string
    if (c === NODE_OPEN) {
      nextIsValue = false // Make sure the next string is interpreted as a key.

      var parsed = _parse(stream, i + 1)
      deserialized.set(laststr, parsed[0])
      i = parsed[1]
    } else if (c === NODE_CLOSE) {
      return [deserialized, i]
    } else if (c === BR_OPEN) {
      _string = _symtostr(stream, i, BR_CLOSE)
      lastbrk = _string[0]
      i = _string[1]
    } else if (c === COMMENT) {
      if ((i + 1) < stream.length && stream.substring(i + 1, i + 2) === '/') {
        i = stream.indexOf('\n', i)
      }
    } else if (c === CR || c === LF) {
      var ni = i + 1
      if (ni < stream.length && stream.substring(ni, ni + 1) === LF) {
        i = ni
      }
      if (lasttok !== LF) {
        c = LF
      }
    } else if (c !== SPACE && c !== TAB) {
      _string = (c === STRING ? _symtostr : _unquotedtostr)(stream, i)
      var string = _string[0]
      i = _string[1]

      if (lasttok === STRING && nextIsValue) {
        if (deserialized.has(laststr) && lastbrk !== undefined) {
          lastbrk = undefined // Ignore this sentry if it's the second bracketed expression
        } else {
          deserialized.set(laststr, string)
        }
      }
      c = STRING // Force c == string so lasttok will be set properly.
      laststr = string
      nextIsValue = !nextIsValue
    } else {
      c = lasttok
    }

    lasttok = c
    i += 1
  }

  return [deserialized, i]
}

function _dump (obj, indent, mult) {
  indent = indent || 0
  mult = mult || 4

  function _i () {
    return Array(indent * mult + 1).join(' ')
  }

  var distance
  var kvSpaces

  var nodefmt = '\n' + _i() + '"%s"\n' + _i() + '{\n%s' + _i() + '}\n\n'
  var podfmt = _i() + '%s"%s"\n'
  var lstfmt = _i() + (Array(mult + 1).join(' ')) + '"%s" "1"'

  indent += 1

  var nodes = []

  for (var [k, v] of obj) {
    if (typeof v === 'object' && !(v instanceof Array)) {
      nodes.push(util.format(nodefmt, k, _dump(v, indent, mult)))
    } else if (v instanceof Array) {
      var lst = v.map(function (moreV) {
        return util.format(lstfmt, moreV)
      })
      nodes.push(util.format(nodefmt, k, lst.join('\n') + '\n'))
    } else {
      if (!distance) {
        distance = k.length + 16
      }
      kvSpaces = distance - k.length
      if (kvSpaces < 0) {
        nodes.push(util.format(podfmt, '"' + k + '"' + ' ', v))
      } else {
        nodes.push(util.format(podfmt, '"' + k + '"' + Array(kvSpaces).join(' '), v))
      }
    }
  }

  indent -= 1
  return nodes.join('')
}

/**
 * Sort a map placing keyvalues at the top and parentkeys at the bottom.
 * @param  {Map} map to be sorted
 * @return {Map} sorted map
 */
function _sortMap (map) {
  var result = new VDFMap()

  var keys = []
  var parentkeys = []

  for (var [key, value] of map) {
    if (typeof value === 'string') {
      keys.push(key)
    } else {
      parentkeys.push(key)
      // sort map recursively
      map.set(key, _sortMap(value))
    }
  }

  for (var i = 0; i < keys.length; i++) {
    result.set(keys[i], map.get(keys[i]))
  }

  for (var j = 0; j < parentkeys.length; j++) {
    result.set(parentkeys[j], map.get(parentkeys[j]))
  }

  return result
}

/**
 * Parse the given string to a KV Map.
 * The returned Map will eb ordered unlike a default js object.
 * @param  {string} string the string to be parsed.
 * @return {Map} the map holding the kv data.
 */
exports.parse = (string) => {
  var _parsed = _parse(string)
  var res = _parsed[0]
  res = _sortMap(res)
  // var ptr = _parsed[1]
  return res
}

/**
 * Dump a KV Map to string.
 * @param  {Map} obj the data.
 * @return {string} the formatted KV string.
 */
exports.dump = (obj) => {
  return _dump(obj)
}
