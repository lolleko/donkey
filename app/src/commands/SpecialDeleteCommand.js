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
      this.parentElement = this.element.parentKVElement
      this.element = this.element.remove()
    }
  }

  undo () {
    if (this.element) {
      this.parentElement.insert(this.element)
    }
  }
}

module.exports = donkey.commands.add('specialdelete', SpecialDeleteCommand, {accelerator: 'CmdOrCtrl+D'})
