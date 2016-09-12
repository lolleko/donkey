const Command = require('./Command')

class CloseTabCommand extends Command {
  constructor (tabPath) {
    super()

    this.tabPath = tabPath
  }

  execute () {
    donkey.nav.closeTab()
  }

}

module.exports = donkey.commands.add('close-tab', CloseTabCommand)
