const Command = require('./Command')

/**
 * Binding for the builtin cut command.
 */
class CutCommand extends Command {
  execute () {
    document.execCommand('cut')
  }

  // We dont require an undo,
  // since a text cut will be picked up by the input listeners
}

module.exports = donkey.commands.add('cut', CutCommand, {accelerator: 'CmdOrCtrl+X'})
