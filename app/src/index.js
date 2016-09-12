const fs = require('fs')
const path = require('path')

const DonkeyEnviroment = require('./DonkeyEnviroment')

window.donkey = new DonkeyEnviroment()
donkey.lang.loadLanguages()

donkey.files.add('/Users/lmbpro/Desktop/shelter/game/dota_addons/shelter/scripts/npc/npc_abilities_custom.txt')
donkey.files.add('/Users/lmbpro/Desktop/shelter/game/dota_addons/shelter/scripts/npc/test.txt')

// TODO move to a module
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
