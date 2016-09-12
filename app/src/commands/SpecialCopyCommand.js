const clipboard = require('electron').clipboard
const Command = require('./Command')

class SpecialCopyCommand extends Command {
  constructor (element) {
    super()

    if (!element) {
      if (donkey.editor && donkey.editor.activeElement) {
        this.element = donkey.editor.activeElement
      }
    } else {
      this.element = element
    }
  }

  execute () {
    if (this.element) {
      clipboard.writeText(donkey.files.nodeToKVString(this.element))
    }
  }
}

module.exports = donkey.commands.add('specialcopy', SpecialCopyCommand)
