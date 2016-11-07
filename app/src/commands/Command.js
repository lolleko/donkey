/**
 * Abstract command class.
 *
 * Built-In Implementations:
 * - [CloseTabCommand](#closetab)
 * - [CopyCommand](#copycommand)
 * - [CutCommand](#cutcommand)
 * - [NewFileCommand](#newfilecommand)
 * - [OpenDirectoryCommand](#opendirectorycommand)
 * - [PasteCommand](#pastecommand)
 * - [RedoCommand](#redocommand)
 * - [SaveFileCommand](#savefilecommand)
 * - [SpecialCopyCommand](#specialcopycommand)
 * - [UndoableCommand](#undoablecommand)
 * - [UndoCommand](#undocommand)
 * - [ZoomInCommand](#zoomincommand)
 * - [ZoomOutCommand](#zoomoutcommand)
 */
class Command {

  constructor () {
    this.timeStamp = Date.now()
    this.isManipulator = false
  }

  /**
   * Execute the command.
   */
  execute () {}
}

module.exports = Command
