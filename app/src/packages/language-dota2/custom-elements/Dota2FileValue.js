const d2utils = require('./../d2utils')
const path = require('path')

class Dota2FileValue extends donkey.valueElements.file {

  attachedCallback () {
    if (this.options.defaultPath && this.options.context === 'game' && d2utils.getAddonGameDir(donkey.editor.path)) {
      this.defaultPath = path.join(d2utils.getAddonGameDir(donkey.editor.path), this.options.defaultPath)
    } else if (this.options.defaultPath && this.options.context === 'content' && d2utils.getAddonContentDir(donkey.editor.path)) {
      this.defaultPath = path.join(d2utils.getAddonContentDir(donkey.editor.path), this.options.defaultPath)
    } else {
      this.defaultPath = d2utils.getGameRoot(donkey.editor.path)
    }
    super.attachedCallback()
  }

  set value (value) {
    if (value !== this.input.value) {
      this.input.value = value
    }
    this.emitValueChange(value)
  }

  get value () {
    return this.input.value
  }

  get absolutePath () {
    // only avaliable after attach
    if (this.defaultPath) {
      return path.join(this.defaultPath, this.value)
    }
    return this.value
  }

  modfifyResultPath (filePath) {
    // make path relative to defaultPath
    filePath = filePath.replace(this.defaultPath, '')
    var filePathArr = filePath.split(path.sep)
    filePath = path.posix.join(...filePathArr)
    // apply possible BaseClass modifications
    return super.modfifyResultPath(filePath)
  }
}
module.exports = document.registerElement('dota2-file-value', Dota2FileValue)
