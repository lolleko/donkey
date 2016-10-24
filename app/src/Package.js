const fs = require('fs')
const path = require('path')

class Package {
  constructor (packagePath) {
    this.packagePath = packagePath

    this.packageMetaData = JSON.parse(fs.readFileSync(path.join(packagePath, 'package.json')), 'utf8')

    var mainModule = this.packageMetaData.main || 'index.js'
    try {
      this.mainModule = require(path.join(packagePath, mainModule))
    } catch (e) {
      console.log('No main module found for package \'' + path.basename(packagePath) + '\'')
    }

    if (this.isTheme) {
      this.loadTheme()
    }

    if (this.isLanguage) {
      this.loadLanguage()
    }

    this.loadCommands()

    this.loadCustomElements()

    this.loadMenus()
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

    this.loadLanguageTemplates()
  }

  loadLanguageTemplates () {
    var templates = []
    try {
      templates = fs.readdirSync(path.join(this.packagePath, '/templates'))
    } catch (e) {
      console.log('No templates found in ' + this.packagePath + '.')
    }
    for (var j = 0; j < templates.length; j++) {
      donkey.lang.registerTemplate(templates[j].replace(path.extname(templates[j]), ''), fs.readFileSync(path.join(this.packagePath, '/templates', templates[j]), 'utf8'))
    }
  }

  loadMenus () {
    var menus = []
    try {
      menus = fs.readdirSync(path.join(this.packagePath, '/menus'))
    } catch (e) {
      console.log('No menus found in ' + this.packagePath + '.')
    }
    for (var j = 0; j < menus.length; j++) {
      require(path.join(this.packagePath, '/menus', menus[j]))
    }
  }

  loadCustomElements () {
    var elements = []
    try {
      elements = fs.readdirSync(path.join(this.packagePath, '/custom-elements'))
    } catch (e) {
      console.log('No elements found in ' + this.packagePath + '.')
    }
    for (var j = 0; j < elements.length; j++) {
      require(path.join(this.packagePath, '/custom-elements', elements[j]))
    }
  }

  loadCommands () {
    var elements = []
    try {
      elements = fs.readdirSync(path.join(this.packagePath, '/commands'))
    } catch (e) {
      console.log('No commands found in ' + this.packagePath + '.')
    }
    for (var j = 0; j < elements.length; j++) {
      require(path.join(this.packagePath, '/commands', elements[j]))
    }
  }

  loadTheme () {
    donkey.themes.add(this.packageMetaData.name, path.join(this.packagePath, this.packageMetaData.themeMain))
  }
}

module.exports = Package
