const clipboard = require('electron').clipboard
const UndoableCommand = require('./UndoableCommand')

class SpecialPasteCommand extends UndoableCommand {
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
    if (this.element && clipboard.readText() !== '') {
      this.pastedElements = this.element.insert(donkey.files.KVstringToNode(clipboard.readText()))
    }
  }

  undo () {
    for (var i = 0; i < this.pastedElements.length; i++) {
      this.pastedElements[i].remove()
    }
  }
}

module.exports = donkey.commands.add('specialpaste', SpecialPasteCommand)
