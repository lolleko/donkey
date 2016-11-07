/**
 * Moves the active KV ELement down.
 */
class MoveDownCommand extends UndoableCommand {
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
      this.element.moveDown()
    }
  }

  undo () {
    this.element.moveUp()
  }
}

module.exports = donkey.commands.add('movedown', MoveDownCommand, {accelerator: 'CmdOrCtrl+Down'})
