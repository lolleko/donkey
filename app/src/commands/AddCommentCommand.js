class AddCommentCommand extends UndoableCommand {
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
      var kv = document.createElement('donkey-comment')
      kv.value = ''
      this.addedElement = this.element.insert(kv)
      kv.focus()
      kv.select()
    }
  }

  undo () {
    this.addedElement.parentNode.removeChild(this.addedElement)
  }
}

module.exports = donkey.commands.add('addcomment', AddCommentCommand, {accelerator: 'CmdOrCtrl+,'})
