const path = require('path')
const fs = require('fs')
const Package = require('./Package')

class PackageManager {
  constructor () {
    this.packages = {}
    this.appData = require('electron').remote.app.getPath('userData')

    // ensure packages directory exists
    try {
      fs.statSync(this.packagesDir).isDirectory()
    } catch (e) {
      fs.mkdirSync(this.packagesDir)
    }

    // TODO move this somewhere else
    var customElementDir = fs.readdirSync(path.join(__dirname, 'custom-elements'))
    for (var i = 0; i < customElementDir.length; i++) {
      var elementPath = './' + path.join('custom-elements', customElementDir[i])
      require(elementPath)
    }

    var commandsDir = fs.readdirSync(path.join(__dirname, 'commands'))
    for (i = 0; i < commandsDir.length; i++) {
      var commandPath = './' + path.join('commands', commandsDir[i])
      require(commandPath)
    }

    this.load()
  }

  get packagesDir () {
    return path.join(this.appData, 'packages')
  }

  get (name) {
    return this.packages[name]
  }

  load () {
    this.loadDirectory(path.join(__dirname, 'packages'))
    this.loadDirectory(this.packagesDir)
  }

  loadDirectory (dir) {
    var packages = fs.readdirSync(dir)
    for (var j = 0; j < packages.length; j++) {
      var packDir = path.join(dir, packages[j])
      try {
        fs.statSync(path.join(packDir, 'package.json')).isFile()
        try {
          this.packages[packDir] = new Package(packDir)
        } catch (e) {
          console.log('Could not load package\'' + packDir + '\'!')
          console.error(e)
        }
      } catch (e) {
        console.log('Missing package.json in \'' + packDir + '\' please create the file see: https://docs.npmjs.com/files/package.json for more information.')
      }
    }
  }

}

module.exports = PackageManager
