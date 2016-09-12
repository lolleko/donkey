const UndoableCommand = require('./UndoableCommand')

class AddKeyValueCommand extends UndoableCommand {
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
      var kv = document.createElement('key-value')
      kv.key = 'NEWKEY'
      kv.value = 'NEWVALUE'
      this.addedElement = this.element.insert(kv)
      kv.focus()
      kv.select()
    }
  }

  undo () {
    this.element.removeChild(this.addedElement)
  }
}

module.exports = donkey.commands.add('addkeyvalue', AddKeyValueCommand)
