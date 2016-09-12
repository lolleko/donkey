const Command = require('./Command')

class OpenFileCommand extends Command {
  constructor (files) {
    super()

    this.filePath = files[0]
  }

  execute () {
    donkey.files.add(this.filePath)
  }

}

module.exports = donkey.commands.add('open-file', OpenFileCommand, false, true)
