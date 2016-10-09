const kvpath = require('./kvpath')

class VDFMap {
  constructor (iterable = []) {
    this._entries = {}
    this._order = [] // index -> key
    for (let [k, v] of iterable) {
      this.set(k, v)
    }
  }

  get size () {
    return this._order.length
  }

  set (key, value) {
    if (!this.has(key)) {
      this._order.push(key)
    }
    this._entries[key] = value
  }

  setPath (kvPath, value) {
    this._setPath(kvpath.toArray(kvPath), value, this)
  }

  _setPath (pathArr, value, subMap) {
    var current = pathArr.shift()

    if (!subMap.has(current)) {
      subMap.set(current, new VDFMap())
    }

    if (pathArr.length === 0) {
      subMap.set(current, value)
    } else {
      this._setPath(pathArr, value, subMap.get(current))
    }
  }

  get (key) {
    return this._entries[key]
  }

  getPath (kvPath) {
    return this._getPath(kvpath.toArray(kvPath), this)
  }

  _getPath (pathArr, subMap) {
    if (pathArr.length === 0) {
      return subMap
    }
    var current = pathArr.shift()

    if (!subMap.has(current)) {
      return undefined
    }

    if (pathArr.length === 0) {
      return subMap.get(current)
    } else {
      return this._getPath(pathArr, subMap.get(current))
    }
  }

  has (key) {
    return this._entries.hasOwnProperty(key)
  }

  hasPath (kvPath) {
    if (this.getPath(kvPath)) {
      return true
    } else {
      return false
    }
  }

  delete (key) {
    if (this.has(key)) {
      var previous = this._entries[key]
      delete this._entries[key]
      this._order.splice(this._order.indexOf(key), 1)
      return previous
    } else {
      return undefined
    }
  }

  deletePath (kvPath) {
    var pathArr = kvpath.toArray(kvPath)
    var basename = pathArr.pop()
    var subMap = this._getPath(pathArr, this)
    if (subMap) {
      return subMap.delete(basename)
    }
    return undefined
  }

  _insertAt (key, value, index) {
    this._entries[key] = value
    if (index === 0) {
      this._order.unshift(key)
    } else {
      this._order.splice(index, 0, key)
    }
  }

  insertAfter (key, value, existingKey) {
    if (!this.has(existingKey)) {
      throw new TypeError('existingKey is not contained in this map!')
    }

    var index = this._order.indexOf(existingKey) + 1

    if (index === this._order.length) {
      this.set(key, value)
    } else {
      this._insertAt(key, value, index)
    }
  }

  insertAfterPath (key, value, existingPath) {
    if (!this.hasPath(existingPath)) {
      throw new TypeError('existingPath is not contained in this map!')
    }

    var pathArr = kvpath.toArray(existingPath)
    var basename = pathArr.pop()
    var subMap = this._getPath(pathArr, this)

    if (subMap) {
      subMap.insertAfter(key, value, basename)
    }
  }

  insertBefore (key, value, existingKey) {
    if (!this.has(existingKey)) {
      throw new TypeError('existingKey is not contained in this map!')
    }

    var index = this._order.indexOf(existingKey) - 1

    if (index === -1) {
      this._insertAt(key, value, 0)
    } else {
      this._insertAt(key, value, index)
    }
  }

  insertBeforePath (key, value, existingPath) {
    if (!this.hasPath(existingPath)) {
      throw new TypeError('existingPath is not contained in this map!')
    }

    var pathArr = kvpath.toArray(existingPath)
    var basename = pathArr.pop()
    var subMap = this._getPath(pathArr, this)

    if (subMap) {
      subMap.insertBefore(key, value, basename)
    }
  }

  * entries () {
    for (var i = 0; i < this._order.length; i++) {
      var key = this._order[i]
      yield [key, this._entries[key]]
    }
  }
  * keys () {
    for (var i = 0; i < this._order.length; i++) {
      yield this._order[i]
    }
  }
  * values () {
    for (var i = 0; i < this._order.length; i++) {
      yield this._entries[this._order[i]]
    }
  }
}

Object.defineProperty(VDFMap.prototype, Symbol.iterator, {configurable: true, writable: true, value: VDFMap.prototype.entries})

module.exports = VDFMap
