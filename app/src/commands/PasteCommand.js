/**
 * Binding for the chrome-builtin paste command.
 */
class PasteCommand extends Command {
  execute () {
    document.execCommand('paste')
  }

  // We dont require an undo,
  // since a text paste will be picked up by the input listeners
}

module.exports = donkey.commands.add('paste', PasteCommand, {accelerator: 'CmdOrCtrl+V'})
