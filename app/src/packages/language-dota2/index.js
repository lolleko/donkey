const path = require('path')
const fs = require('fs')

class Dota2KV {
  activate () {
    var templates = fs.readdirSync(path.join(__dirname, '/templates'))
    for (var i = 0; i < templates.length; i++) {
      donkey.lang.registerTemplate(templates[i].replace(path.extname(templates[i]), ''), fs.readFileSync(path.join(__dirname, 'templates', templates[i]), 'utf8'), 'kv1')
    }

    var menus = fs.readdirSync(path.join(__dirname, '/menus'))
    for (var j = 0; j < menus.length; j++) {
      require('./menus/' + menus[j])
    }

    var elements = fs.readdirSync(path.join(__dirname, '/custom-elements'))
    for (var h = 0; h < elements.length; h++) {
      require('./custom-elements/' + elements[h])
    }

    var commands = fs.readdirSync(path.join(__dirname, '/commands'))
    for (var k = 0; k < commands.length; k++) {
      require('./commands/' + commands[k])
    }

    this.package.addMenu('Dota 2', [
      {label: 'Generate Tooltips', command: 'dota2:generatetooltips'}
    ])
  }
}

module.exports = Dota2KV
