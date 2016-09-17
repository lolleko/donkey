/**
 * Proxy for managing and modifing files.
 */

const KVFile = require('./KVFile')
const kvpath = require('./kvpath')
const vdf = require('./vdf')

class FileManager {
  constructor () {
    /**
     * An object containing the currently this.openFiles as KVFile.
     * The KVFiles are indexed by their absolute paths.
     * @type {Object}
     */
    this.openFiles = {}

    /**
     * A string storing the filepath of the file that is currently being edited.
     * @type {string}
     */
    this.activeFile = ''
  }

  /**
   * Add a new file to the this.openFiles.
   * @param {string} path the path of the file.
   * @return {KVFile} the created file.
   */
  add (path) {
    path = kvpath.filepath(path)
    var kvFile = new KVFile(path)
    this.openFiles[path] = kvFile
    donkey.nav.addFile(kvFile)
    return kvFile
  }

  /**
   * Closes a file and removes it from the this.openFiles.
   * @param {string} path the path of the file.
   */
  close (path) {
    path = kvpath.filepath(path)
    this.openFiles[path].close()
    this.openFiles[path] = null
  }

  /**
   * Rename an openFile,
   * @param {string} oldPath the current path/name of the file.
   * @param {string} newPath the new path/name.
   */
  rename (oldPath, newPath) {
    oldPath = kvpath.filepath(oldPath)
    var temp = this.openFiles[oldPath]
    temp.rename(newPath)
    this.openFiles[oldPath] = null
    this.openFiles[newPath] = temp
  }

  /**
   * Write the current data to the file.
   * @param {string} path the path/name of the file.
   */
  write (path) {
    path = path || this.activeFile
    path = kvpath.filepath(path)
    this.openFiles[path].write()
  }

  /**
   * [writeData description]
   * @param {string} kvPath the path of the data to change
   * @param {Map} data the data to write
   */
  writeData (kvPath, data) {
    var pathArr = kvpath.toArray(kvPath)
    var kvFile = this.openFiles[pathArr[0]]
    var pointer = kvFile.data

    if (pathArr.length === 1) {
      kvFile.data = data
    } else {
      for (var i = 1; i < pathArr.length - 1; i++) {
        if (!pointer.has(pathArr[i])) {
          pointer.set(pathArr[i], new Map())
        }
        pointer = pointer.get(pathArr[i])
      }

      var basename = pathArr[pathArr.length - 1]

      if (!pointer.has(basename)) {
        var tempMap = new Map(pointer)
        pointer.clear()
        for (var [key, value] of tempMap) {
          if (basename < key) {
            pointer.set(basename, data)
          }
          pointer.set(key, value)
        }
        if (!pointer.has(basename)) {
          pointer.set(basename, data)
        }
      } else {
        pointer.set(basename, data)
      }
    }
    donkey.nav.rebuildTreeView()
  }

  readData (kvPath) {
    var pathArr = kvpath.toArray(kvPath)
    var kvFile = this.openFiles[pathArr.shift()]
    var pointer = kvFile.data

    if (pathArr.length === 0) {
      return pointer
    }

    for (var i = 0; i < pathArr.length - 1; i++) {
      if (!pointer.has(pathArr[i])) {
        return
      }
      pointer = pointer.get(pathArr[i])
    }

    var basename = pathArr[pathArr.length - 1]

    if (pointer.has(basename)) {
      return pointer.get(basename)
    }
  }

  duplicateData (kvPath) {
    var data = this.readData(kvPath)
    if (data) {
      var suffix = '_copy'
      var i = 1
      var dupeName = kvPath + suffix
      while (this.pathExists(dupeName)) {
        dupeName = kvPath + suffix + i
      }
      this.writeData(dupeName, data)
    }
  }

  unlinkData (kvPath) {
    var pathArr = kvpath.toArray(kvPath)
    var kvFile = this.openFiles[pathArr[0]]
    var pointer = kvFile.data

    for (var i = 1; i < pathArr.length - 1; i++) {
      if (!pointer.has(pathArr[i])) {
        return false
      }
      pointer = pointer.get(pathArr[i])
    }

    var basename = pathArr[pathArr.length - 1]

    if (pointer.has(basename)) {
      pointer.delete(basename)
      donkey.nav.rebuildTreeView()
      return true
    }

    return false
  }

  nodeToData (node) {
    var result = new Map()
    if (node.localName === 'parent-key') {
      return result.set(node.key, this._nodeToData(node, result.get(node.key)))
    } else {
      if (node.localName === 'key-value') {
        return new Map([[node.key, node.value]])
      } else {
        return this._nodeToData(node)
      }
    }
  }

  _nodeToData (element) {
    var map = new Map()
    var children = element.subKVElements
    for (var i = 0; i < children.length; i++) {
      var node = children[i]
      if (node.localName === 'key-value') {
        map.set(node.key, node.value)
      } else if (node.localName === 'parent-key') {
        map.set(node.key, this._nodeToData(node))
      }
    }
    return map
  }

  dataToNode (data) {
    var fragment = document.createDocumentFragment()

    for (var [key, value] of data) {
      if (typeof value === 'string') {
        var keyValue = document.createElement('key-value')
        keyValue.key = key
        keyValue.value = value
        fragment.appendChild(keyValue)
      } else {
        var parentKey = document.createElement('parent-key')
        parentKey.key = key
        parentKey.data = value
        fragment.appendChild(parentKey)
      }
    }
    return fragment
  }

  KVstringToNode (string) {
    return this.dataToNode(vdf.parse(string))
  }

  nodeToKVString (node) {
    return vdf.dump(this.nodeToData(node))
  }

  renameData (kvPathOld, newName) {}

  /**
   * Check if data exists at the given kvpath.
   * @param  {string} kvPath to check
   * @return {boolean} wether the path exists or not
   */
  pathExists (kvPath) {
    var pathArr = kvpath.toArray(kvPath)
    var kvFile = this.openFiles[pathArr[0]]
    var pointer = kvFile.data

    for (var i = 1; i < pathArr.length; i++) {
      if (!pointer.has(pathArr[i])) {
        return false
      }
      pointer = pointer.get(pathArr[i])
    }

    return true
  }

  /**
   * Get the currently open files.
   * @return {Object} containing all open files.
   */
  getOpen () {
    return this.openFiles
  }

  /**
   * Get a open file via the path.
   * @return {KVFile} with the given path
   */
  get (path) {
    path = kvpath.filepath(path)
    return this.openFiles[path]
  }

  /**
   * Sets the currently edited file
   * @param {string} path the kvpath or filepath
   */
  setActive (path) {
    this.activeFile = kvpath.filepath(path)
    donkey.lang.setActiveCategory(this.getActive().category)
  }

  /**
   * Returns the active file.
   * @return {KVFile} file
   */
  getActive () {
    return this.openFiles[this.activeFile]
  }

  /**
   * Returns the active file's filepath.
   * @return {string} filepath
   */
  getActivePath () {
    return this.activeFile
  }

  /**
   * Returns the active file's filename.
   * @return {string} filename
   */
  getActiveName () {
    return kvpath.filename(this.activeFile)
  }
}

module.exports = FileManager
