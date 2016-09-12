const Command = require('./Command')

class UndoableCommand extends Command {
  constructor () {
    super()
    this.isUndoable = true
    this.isMergable = false
    this.isManipulator = true
    this.maxMerges = 0
    this.merges = 0
    this.mergeDelay = 0
  }

  undo () {}

  redo () {
    this.execute()
  }

  merge (prevCmd) {}
}

module.exports = UndoableCommand
