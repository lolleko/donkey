class ZoomInCommand extends Command {

  execute () {
    var oldSize = parseInt(document.documentElement.style.fontSize, 10)
    if (oldSize < 30) {
      document.documentElement.style.fontSize = (oldSize + 2) + 'px'
    }
  }

}

module.exports = donkey.commands.add('zoomin', ZoomInCommand, {accelerator: 'CmdOrCtrl+Plus', executeGlobal: true})
