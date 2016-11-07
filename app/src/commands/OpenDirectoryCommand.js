class OpenDirectoryCommand extends Command {
  constructor (files) {
    super()

    this.filePath = donkey.dialog.showOpenDirectory()
  }

  execute () {
    if (this.filePath) {
      donkey.files.addDir(this.filePath)
    }
  }

}

module.exports = donkey.commands.add('open-directory', OpenDirectoryCommand, {accelerator: 'CmdOrCtrl+Shift+O', executeGlobal: true})
