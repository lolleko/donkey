const fs = require('fs')
const path = require('path')

const DonkeyEnviroment = require('./DonkeyEnviroment')

window.donkey = new DonkeyEnviroment()

donkey.files.add('/Users/lmbpro/Desktop/shelter/game/dota_addons/shelter/scripts/npc/npc_abilities_custom.txt')
donkey.files.add('/Users/lmbpro/Desktop/shelter/game/dota_addons/shelter/scripts/npc/test.txt')
