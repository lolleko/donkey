const Command = require('./Command')

class SaveFileCommand extends Command {
  constructor (filePath) {
    super()

    this.filePath = filePath
  }

  execute () {
    donkey.editor.save()
  }

}

module.exports = donkey.commands.add('save-file', SaveFileCommand)
