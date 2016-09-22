const Command = require('./Command')

class NewFileCommand extends Command {
  constructor (filePath) {
    super()

    this.filePath = donkey.dialog.showSaveDialog()
  }

  execute () {
    if (this.filePath) {
      donkey.files.add(this.filePath)
    }
  }

}

module.exports = donkey.commands.add('new-file', NewFileCommand, {accelerator: 'CmdOrCtrl+N', executeGlobal: true})
