const Command = require('./Command')

/**
 * Binding for the builtin copy command.
 */
class CopyCommand extends Command {
  execute () {
    document.execCommand('copy')
  }
}

module.exports = donkey.commands.add('copy', CopyCommand, {accelerator: 'CmdOrCtrl+V'})
