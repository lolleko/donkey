const fs = require('fs')
const path = require('path')
const PathWatcher = require('pathwatcher')

class ConfigManager {
  constructor () {
    this.appData = require('electron').remote.app.getPath('userData')
    this.configPath = path.join(this.appData, 'config.json')
    this.listeners = {}

    // makesure the main config file exists
    try {
      fs.statSync(this.configPath).isFile()
    } catch (e) {
      fs.writeFileSync(this.configPath, fs.readFileSync(path.join(__dirname, '../static/config/config.json')))
    }

    // Register pathwatcher to check for manual file changes or changes by antoher window
    this.watcher = PathWatcher.watch(this.configPath, (e) => {
      if (e === 'change') {
        this.reload()
      }
    })

    this.read()
  }

  write () {
    this.writing = true
    fs.writeFile(this.configPath, JSON.stringify(this.configObj), () => {
      this.writing = false
    })
  }

  read () {
    this.configObj = JSON.parse(fs.readFileSync(this.configPath, 'utf8'))
  }

  reload () {
    if (this.writing) {
      return
    }
    var oldConfigObj = this.configObj

    this.read()

    // invoke change events for all changed values
    for (var listener in this.listeners) {
      var oldVal = this._get(listener.split('.'), oldConfigObj)
      var newVal = this.get(listener)
      if (oldVal !== newVal) {
        this.emitChange(listener, oldVal, newVal)
      }
    }
  }

  set (objPath, value) {
    var oldVal = this.get(objPath)
    this._set(objPath.split('.'), value, this.configObj)
    // broadcast changes
    this.emitChange(objPath, oldVal, value)
    // always write the config after setting a new value
    this.write()
  }

  _set (objPathArr, value, subObj) {
    var current = objPathArr.shift()

    if (!subObj[current]) {
      subObj[current] = {}
    }

    if (objPathArr.length === 0) {
      subObj[current] = value
    } else {
      this._set(objPathArr, value, subObj[current])
    }
  }

  get (objPath) {
    return this._get(objPath.split('.'), this.configObj)
  }

  _get (objPathArr, subObj) {
    var current = objPathArr.shift()

    if (!subObj[current]) {
      return undefined
    }

    if (objPathArr.length === 0) {
      return subObj[current]
    } else {
      return this._get(objPathArr, subObj[current])
    }
  }

  has (objPath) {
    if (this._get(objPath.split('.'), this.configObj)) {
      return true
    } else {
      return false
    }
  }

  onChange (objPath, callback) {
    if (!this.listeners[objPath]) {
      this.listeners[objPath] = []
    }
    this.listeners[objPath].push(callback)
  }

  emitChange (objPath, oldVal, newVal) {
    var listenerCallbacks = this.listeners[objPath]
    if (listenerCallbacks) {
      for (var i = 0; i < listenerCallbacks.length; i++) {
        listenerCallbacks[i](oldVal, newVal)
      }
    }
  }
}

module.exports = ConfigManager
