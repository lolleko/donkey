/**
 * This command is called everytime a value input element changes it's value.
 * It should not be executed manually unless you are sure what you are doing.
 */
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
    this.element.preventChangeCallback = true
    this.element.value = this.redoValue
    this.element.focus()
  }

  undo () {
    this.redoValue = this.element.value
    this.element.preventChangeCallback = true
    this.element.value = this.oldValue
    this.element.focus()
  }

  merge (newCmd) {
    if (newCmd.element === this.element) {
      return true
    }

    return false
  }
}

module.exports = donkey.commands.add('valuechange', SaveValueChangeCommand)
