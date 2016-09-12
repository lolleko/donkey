const Command = require('./Command')

/**
 * Binding for the builtin paste command.
 */
class PasteCommand extends Command {
  execute () {
    document.execCommand('paste')
  }

  // We dont require an undo,
  // since a text paste will be picked up by the input listeners
}

module.exports = donkey.commands.add('paste', PasteCommand)
