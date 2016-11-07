class OpenFileCommand extends Command {
  constructor (files) {
    super()

    this.filePath = donkey.dialog.showOpenFile()
  }

  execute () {
    if (this.filePath) {
      donkey.files.add(this.filePath)
    }
  }

}

module.exports = donkey.commands.add('open-file', OpenFileCommand, {accelerator: 'CmdOrCtrl+O', executeGlobal: true})
