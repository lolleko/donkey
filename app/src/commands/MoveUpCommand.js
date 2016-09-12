const UndoableCommand = require('./UndoableCommand')

class MoveUpCommand extends UndoableCommand {
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
      this.element.moveUp()
    }
  }

  undo () {
    this.element.moveDown()
  }
}

module.exports = donkey.commands.add('moveup', MoveUpCommand)
