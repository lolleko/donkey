class RedoCommand extends Command {
  execute () {
    if (donkey.editor) {
      donkey.editor.redo()
    }
  }
}

module.exports = donkey.commands.add('redo', RedoCommand, {accelerator: 'CmdOrCtrl+Y'})
