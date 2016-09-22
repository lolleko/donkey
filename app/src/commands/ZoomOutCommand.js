const Command = require('./Command')

class ZoomOutCommand extends Command {

  execute () {
    var oldSize = parseInt(document.documentElement.style.fontSize, 10)
    if (oldSize > 4) {
      document.documentElement.style.fontSize = (oldSize - 2) + 'px'
    }
  }

}

module.exports = donkey.commands.add('zoomout', ZoomOutCommand, {accelerator: 'CmdOrCtrl+-', executeGlobal: true})
