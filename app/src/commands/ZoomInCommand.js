const Command = require('./Command')

class ZoomInCommand extends Command {

  execute () {
    var oldSize = parseInt(document.documentElement.style.fontSize, 10)
	console.log(oldSize);
    if (oldSize < 30) {
      document.documentElement.style.fontSize = (oldSize + 2) + 'px'
    }
  }

}

module.exports = donkey.commands.add('zoomin', ZoomInCommand, false, true)
