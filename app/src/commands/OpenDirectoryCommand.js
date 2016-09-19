const Command = require('./Command')

class OpenDirectoryCommand extends Command {
  constructor (files) {
    super()

    this.filePath = files[0]
  }

  execute () {
    donkey.files.addDir(this.filePath)
  }

}

module.exports = donkey.commands.add('open-directory', OpenDirectoryCommand, false, true)
