const UndoableCommand = require('./UndoableCommand')

class SaveKeyChangeCommand extends UndoableCommand {
  constructor (element, oldKey) {
    super()

    this.isMergable = true
    this.maxMerges = 16
    this.mergeDelay = 500

    if (!element || !oldKey) {
      this.isUndoable = false
    }

    this.element = element
    this.oldKey = oldKey
  }

  execute () {

  }

  redo () {
    this.element.keyElement.preventCallback = true
    this.element.keyElement.key = this.redoValue
    this.element.keyElement.focus()
  }

  undo () {
    this.redoValue = this.element.keyElement.key
    this.element.keyElement.preventCallback = true
    this.element.keyElement.key = this.oldKey
    this.element.keyElement.focus()
  }

  merge (newCmd) {
    if (newCmd.element === this.element) {
      return true
    }

    return false
  }
}

module.exports = donkey.commands.add('keychange', SaveKeyChangeCommand)
