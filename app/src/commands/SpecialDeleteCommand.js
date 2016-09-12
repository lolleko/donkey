const UndoableCommand = require('./UndoableCommand')

class SpecialDeleteCommand extends UndoableCommand {
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
      this.parentElement = this.element.previousSibling
      if (!this.parentElement || (this.parentElement.tagName !== 'PARENT-KEY' && this.parentElement.tagName !== 'KEY-VALUE')) {
        this.parentElement = this.element.parentNode
      }
      this.element = this.element.remove()
    }
  }

  undo () {
    if (this.element) {
      this.parentElement.insert(this.element)
    }
  }
}

module.exports = donkey.commands.add('specialdelete', SpecialDeleteCommand)
