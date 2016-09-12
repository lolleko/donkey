const Command = require('./Command')

class NewFileCommand extends Command {
  constructor (filePath) {
    super()

    this.filePath = filePath
  }

  execute () {
    donkey.files.add(this.filePath)
  }

}

module.exports = donkey.commands.add('new-file', NewFileCommand, false, true)
