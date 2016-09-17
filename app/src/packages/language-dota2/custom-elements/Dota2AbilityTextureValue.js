const path = require('path')
const Dota2FileValue = require('./Dota2FileValue')

class Dota2AbilityTextureValue extends Dota2FileValue {

  modfifyResultPath (filePath) {
    var filePathArr = filePath.split(path.sep)
    if (filePathArr[filePathArr.length - 2] === 'items') {
      return 'item_' + path.basename(filePath, path.extname(filePath))
    } else if (filePathArr[filePathArr.length - 2] === 'spellicons') {
      return path.basename(filePath, path.extname(filePath))
    }
    // show raning that name could not be automatically set
    donkey.dialog.showSimpleMessage('There was an issue setting the texturename. Please make sure the generated name is correct.', 'This happend because you selected a file not contained in \'resource/spellicons\' or \'resource/items\'.')
    return path.basename(filePath, path.extname(filePath))
  }
}
module.exports = document.registerElement('dota2-ability-texture-value', Dota2AbilityTextureValue)
