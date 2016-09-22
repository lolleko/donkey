const Command = require('./Command')

class SaveFileCommand extends Command {

  execute () {
    donkey.editor.save()
  }

}

module.exports = donkey.commands.add('save-file', SaveFileCommand, {accelerator: 'CmdOrCtrl+S'})
