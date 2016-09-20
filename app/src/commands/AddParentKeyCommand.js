const UndoableCommand = require('./UndoableCommand')

class AddParentKeyCommand extends UndoableCommand {
  constructor (element) {
    super()

    if (!element) {
      if (donkey.editor && donkey.editor.activeElement) {
        this.element = donkey.editor.activeElement
      } else if (donkey.editor) {
        this.element = donkey.editor
      }
    } else {
      this.element = element
    }
  }

  execute () {
    if (this.element) {
      var pk = document.createElement('parent-key')
      pk.key = 'NEWKEY'
      this.addedElement = this.element.insert(pk)
      pk.focus()
      pk.select()
    }
  }

  undo () {
    this.addedElement.parentNode.removeChild(this.addedElement)
  }
}

module.exports = donkey.commands.add('addparentkey', AddParentKeyCommand)
