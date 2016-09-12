const Command = require('./Command')

class UndoCommand extends Command {
  execute () {
    if (donkey.editor) {
      donkey.editor.undo()
    }
  }
}

module.exports = donkey.commands.add('undo', UndoCommand)
