const UndoableCommand = require('./UndoableCommand')

class SaveValueChangeCommand extends UndoableCommand {
  constructor (element, oldValue) {
    super()

    this.isMergable = true
    this.maxMerges = 16
    this.mergeDelay = 500

    if (!element || !oldValue) {
      this.isUndoable = false
    }

    this.element = element
    this.oldValue = oldValue
  }

  execute () {

  }

  redo () {
    this.element.valueElement.preventCallback = true
    this.element.valueElement.value = this.redoValue
    this.element.valueElement.focus()
  }

  undo () {
    this.redoValue = this.element.valueElement.value
    this.element.valueElement.preventCallback = true
    this.element.valueElement.value = this.oldValue
    this.element.valueElement.focus()
  }

  merge (newCmd) {
    if (newCmd.element === this.element) {
      return true
    }

    return false
  }
}

module.exports = donkey.commands.add('valuechange', SaveValueChangeCommand)
