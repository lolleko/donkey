const fs = require('fs')
const path = require('path')

class Package {
  constructor (packagePath) {
    this.packagePath = packagePath

    this.packageMetaData = JSON.parse(fs.readFileSync(path.join(packagePath, 'package.json')), 'utf8')

    var mainModule = this.packageMetaData.main || 'index'
    try {
      mainModule = path.join(packagePath, mainModule)
      this.mainModule = require(mainModule)
      this.mainModule.package = this
      if (this.mainModule.activate) {
        this.mainModule.activate()
      }
    } catch (e) {
      console.log('No main module found for package \'' + path.basename(packagePath) + '\'')
    }

    if (this.isTheme) {
      this.loadTheme()
    }

    if (this.isLanguage) {
      this.loadLanguage()
    }
  }

  get isTheme () {
    return this.packageMetaData.themeMain
  }

  get isLanguage () {
    return this.packageMetaData.langMain
  }

  loadLanguage () {
    var data = JSON.parse(fs.readFileSync(path.join(this.packagePath, this.packageMetaData.langMain)), 'utf8')
    donkey.lang.add(this.packageMetaData.name, data)
  }

  loadTheme () {
    donkey.themes.add(this.packageMetaData.name, path.join(this.packagePath, this.packageMetaData.themeMain))
  }
}

module.exports = Package
