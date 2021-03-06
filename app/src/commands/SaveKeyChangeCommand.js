/**
 * This command is called everytime a key input element changes it's value.
 * It should not be executed manually unless you are sure what you are doing.
 */
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
    this.element.preventChangeCallback = true
    this.element.key = this.redoValue
    this.element.focus()
  }

  undo () {
    this.redoValue = this.element.key
    this.element.preventChangeCallback = true
    this.element.key = this.oldKey
    this.element.focus()
  }

  merge (newCmd) {
    if (newCmd.element === this.element) {
      return true
    }

    return false
  }
}

module.exports = donkey.commands.add('keychange', SaveKeyChangeCommand)
