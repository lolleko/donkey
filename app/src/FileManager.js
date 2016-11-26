const kvpath = require('./kvpath')
const fs = require('fs')
const path = require('path')
const uuid = require('node-uuid')

/**
 * Proxy for managing and modifing files.
 * An instance of this class is always available at `donkey.files` .
 */
class FileManager {
  constructor () {
    /**
     * An object containing the currently this.openFiles as KVFile.
     * The KVFiles are indexed by their absolute paths.
     * @type {Object}
     */
    this.openFiles = {}

    /**
     * An object containing all available parser.
     * @type {Object}
     */
    this.parser = {}

    /**
     * A string storing the filepath of the file that is currently being edited.
     * @type {string}
     */
    this.activeFilePath

    this.KVMACRO_COMMENT = 'KVMACRO_COMMENT'
  }

  /**
   * Stores the active file
   * @type {KVFile} file
   */
  get activeFile () {
    return this.openFiles[this.activeFilePath]
  }

  set activeFile (path) {
    this.activeFilePath = kvpath.filepath(path)
    donkey.lang.setActiveCategory(this.activeFile.category)
  }

  /**
   * Returns the active file's filename.
   * @return {string} filename
   */
  get activeName () {
    return kvpath.filename(this.activeFilePath)
  }

  get activeFormat () {
    return this.activeFile ? this.activeFile.format : 'kv1'
  }

  /**
   * Add a new file to the this.openFiles.
   * @param {string} path the path of the file.
   * @return {KVFile} the created file.
   */
  add (path) {
    var kvFile = new KVFile(path)
    path = kvpath.filepath(path)
    if (this.openFiles[path]) {
      return this.openFiles[path]
    }

    if (kvFile.hasValidFormat) {
      this.openFiles[path] = kvFile
      donkey.nav.addFile(kvFile)
    }
    return kvFile
  }
  /**
   * Add all files from a directory to the this.openFiles.
   * @param {string} dirPath the path of the file.
   * @return {KVFile} the created file.
   */
  addDir (dirPath) {
    if (this.dirExists(dirPath)) {
      var files = fs.readdirSync(dirPath)
      for (var index in files) {
        var file = files[index]
        if (!this.isSystemFile(file) && this.fileExists(path.join(dirPath, file))) {
          this.add(path.join(dirPath, file))
        }
      }
    }
  }

  /**
   * Closes a file and removes it from the this.openFiles.
   * @param {string} path the path of the file.
   */
  close (path) {
    path = kvpath.filepath(path)
    this.openFiles[path].close()
    delete this.openFiles[path]
    donkey.nav.rebuildTreeView()
  }

  /**
   * Delete and close the file
   * @param {string} path the path of the file.
   */
  unlink (path) {
    path = kvpath.filepath(path)
    this.openFiles[path].close()
    this.openFiles[path].unlink()
    delete this.openFiles[path]
    donkey.nav.rebuildTreeView()
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
    delete this.openFiles[oldPath]
    this.openFiles[newPath] = temp
    donkey.nav.rebuildTreeView()
  }

  /**
   * Write the current data to the file.
   * @param {string} path the path/name of the file.
   */
  write (path) {
    path = path || this.activeFilePath
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

    // File doesnt exist
    if (!kvFile) {
      kvFile = this.add(pathArr[0])
    }

    // Whole File is overwritten
    if (pathArr.length === 1) {
      kvFile.data = data
    } else {
    // save data to path
      kvFile.data.setPath(kvpath.stripfile(kvPath), data)
    }
    kvFile.write()
    donkey.nav.rebuildTreeView()
  }

  readData (kvPath) {
    var kvFile = this.openFiles[kvpath.filepath(kvPath)]

    return kvFile.data.getPath(kvpath.stripfile(kvPath))
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
    if (pathArr.length === 1) {
      this.unlink(pathArr[0])
    } else {
      kvFile.data.deletePath(kvpath.stripfile(kvPath))
      donkey.nav.rebuildTreeView()
    }
  }

  nodeToData (node) {
    var result = new VDFMap()
    if (node.localName === 'parent-key') {
      result.set(node.key, this._nodeToData(node, result.get(node.key)))
      return result
    } else {
      if (node.localName === 'donkey-comment') {
        return new VDFMap([[this.getCommentMacro(), node.value]])
      } else if (node.localName === 'key-value') {
        return new VDFMap([[node.key, node.value]])
      } else {
        return this._nodeToData(node)
      }
    }
  }

  _nodeToData (element) {
    var map = new VDFMap()
    var children = element.subKVElements
    for (var i = 0; i < children.length; i++) {
      var node = children[i]
      if (node.localName === 'donkey-comment') {
        map.set(this.getCommentMacro(), node.value)
      } else if (node.localName === 'key-value') {
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
      if (key.includes(this.KVMACRO_COMMENT)) {
        var comment = document.createElement('donkey-comment')
        comment.value = value
        fragment.appendChild(comment)
      } else if (typeof value === 'string') {
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
    return this.dataToNode(this.parse(string))
  }

  nodeToKVString (node) {
    return this.stringify(this.nodeToData(node))
  }

  renameData (kvPathOld, newPath) {
    this.writeData(newPath, this.readData(kvPathOld))
    this.unlinkData(kvPathOld)
  }

  /**
   * Check if data exists at the given kvpath.
   * @param  {string} kvPath to check
   * @return {boolean} wether the path exists or not
   */
  pathExists (kvPath) {
    var pathArr = kvpath.toArray(kvPath)
    var kvFile = this.openFiles[pathArr[0]]
    if (pathArr.length === 1 && kvFile) {
      return true
    } else if (!kvFile) {
      return false
    }
    return kvFile.data.hasPath(kvpath.stripfile(kvPath))
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

  registerParser (identifier, Prototype) {
    this.parser[identifier] = new Prototype()
    return Prototype
  }

  getParser (identifier) {
    return this.parser[identifier]
  }

  detectFormat (path) {
    var possibleFormats = []
    for (var parserIdentifier in this.parser) {
      if (this.parser[parserIdentifier].detect(path)) {
        try {
          this.parser[parserIdentifier].parse(fs.readFileSync(path, 'utf8'))
          possibleFormats.push(parserIdentifier)
        } catch (e) {}
      }
    }
    // TODO dialog if more than one possible
    return possibleFormats[0]
  }

  parse (text, identifier) {
    identifier = identifier || this.activeFormat
    return this.parser[identifier].parse(text)
  }

  stringify (data, identifier) {
    identifier = identifier || this.activeFormat
    return this.parser[identifier].stringify(data)
  }

  getCommentMacro () {
    return donkey.files.KVMACRO_COMMENT + '<' + uuid.v4() + '>'
  }

  /**
   * Check if the file at the path exists.
   * @param  {String} path Path to check.
   * @return {Boolean} True if the file exists, false if not.
   */
  fileExists (path) {
    var isFile
    try {
      isFile = fs.statSync(path).isFile()
    } catch (e) {
      isFile = false
    }
    return isFile
  }

  dirExists (path) {
    var isDir
    try {
      isDir = fs.statSync(path).isDirectory()
    } catch (e) {
      isDir = false
    }
    return isDir
  }

  isSystemFile (filePath) {
    return path.basename(filePath)[0] === '.'
  }
}

module.exports = FileManager
