const fs = require('fs')
const path = require('path')
const PathWatcher = require('pathwatcher')

/**
 * Manages the users configuration in `AppData`/donkey. <br>
 * Uses dot notation to read and modify the config.json file.
 * An instance of this object is stored at `donkey.config`
 */
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

  /**
   * Write the current config Object to the JSON file.
   */
  write () {
    this.writing = true
    fs.writeFile(this.configPath, JSON.stringify(this.configObj), () => {
      this.writing = false
    })
  }

  /**
   * Parse the contents of the config JSON file to an Object.
   */
  read () {
    this.configObj = JSON.parse(fs.readFileSync(this.configPath, 'utf8'))
  }

  /**
   * Reload the config. This will read the JSON file and fire events for changed values.
   */
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

  /**
   * Set a value
   * @param {String} objPath The path to the value.
   * @param {any} value The value that should be set at the path.
   */
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

  /**
   * Retrieve the value at the provided path.
   * @param  {String} objPath The path to retrieve the value from.
   * @return {any} The value at the path.
   */
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

  /**
   * Check if a value is set at the provided path.
   * @param  {String} objPath The path to check.
   * @return {boolean} Wether the value is set or not.
   */
  has (objPath) {
    if (this._get(objPath.split('.'), this.configObj)) {
      return true
    } else {
      return false
    }
  }

  /**
   * Listen to config changes.
   * @example
   * donkey.config.onChange('donkey.theme', (oldVal, newVal) => {
   *   // Change theme
   * })
   * @param {String} objPath The path to listen for.
   * @param {Function} callback The callback that will be fired on changes.
   */
  onChange (objPath, callback) {
    if (!this.listeners[objPath]) {
      this.listeners[objPath] = []
    }
    this.listeners[objPath].push(callback)
  }

  /**
   * Called internally when an value changes.
   * @param {String} objPath The path that changed.
   * @param {any} oldVal The old value.
   * @param {any} newVal The new value.
   */
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
