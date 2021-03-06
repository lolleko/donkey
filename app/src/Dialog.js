const remote = require('electron').remote
const dialog = remote.dialog
const InputDialog = require('./InputDialog')

/**
 * Proxy for electron dialogs.
 * Also includes a simple custom Input Dialog which will be shown at the top of the window.
 * An instance of this object is stored at `donkey.dialog`
 */
class Dialog {

  /**
   * Show a Input dialog at the top of the window.
   * Allowing the user to isnert a value.
   * @example
   * var options = {
   *   title: 'Enter Path',
   *   detail: 'Absoulte Filepath',
   *   placeholder: '/home/'
   * }
   * donkey.dialog.showInputDialog(options, (value) => {
   *   if (value) {
   *     console.log("CreatingFile: " + value)
   *     // Create File
   *   }
   * }
   * @param  {Object=} options
   * @param  {String} [options.title] The heading of the input dialog.
   * @param  {String} [options.detail] Detail text below the heading.
   * @param  {Boolean} [options.type=input] Either input, kveditor or dropdown.
   * @param  {String} [options.placeholder] Only used if type = input. The placeholder to show in the input element.
   * @param  {Array} [options.choices] Only used if type = dropdown. A list of drop down options.
   * @param  {VDFMap} [options.data] Only used if type = kveditor. A VDFMap containing the initial data.
   * @param  {Function} callback Called when the user presses Enter or Escape
   *                             with the entered (value) as argument,
   *                             or (false) if escape was pressed.
   * @return {InputDialog} The created InputDialog instance.
   */
  showInputDialog (options, callback) {
    return new InputDialog(options, callback)
  }

  showSimpleWarning (message, detail, cancelByDefault) {
    var result = dialog.showMessageBox(remote.getCurrentWindow(), {
      type: 'warning',
      buttons: cancelByDefault ? ['Cancel', 'Continue'] : ['Continue', 'Cancel'],
      defaultId: 0,
      cancelId: cancelByDefault ? 0 : 1,
      title: 'Warning!',
      message: message,
      detail: detail
    })

    return result === (cancelByDefault ? 1 : 0)
  }

  showSimpleQuestion (message, detail, noByDefault) {
    var result = dialog.showMessageBox(remote.getCurrentWindow(), {
      type: 'question',
      buttons: noByDefault ? ['No', 'Yes'] : ['Yes', 'No'],
      defaultId: 0,
      cancelId: noByDefault ? 0 : 1,
      title: '???',
      message: message,
      detail: detail
    })

    return result === (noByDefault ? 1 : 0)
  }

  showSimpleError (message, detail) {
    var result = dialog.showMessageBox(remote.getCurrentWindow(), {
      type: 'error',
      buttons: ['Continue'],
      defaultId: 0,
      title: 'Error!',
      message: message,
      detail: detail
    })

    return result
  }

  showSimpleMessage (message, detail) {
    var result = dialog.showMessageBox(remote.getCurrentWindow(), {
      type: 'warning',
      buttons: ['Okay'],
      defaultId: 0,
      cancelId: 0,
      title: 'Message',
      message: message,
      detail: detail
    })

    return result
  }

  showCloseWarning (itemName) {
    var result = dialog.showMessageBox(remote.getCurrentWindow(), {
      type: 'question',
      buttons: ['Save', 'Cancel', "Don't Save"],
      defaultId: 0,
      cancelId: 1,
      title: 'Warning',
      message: "'" + itemName + "' has changes, do you want to save them?",
      detail: 'Your changes will be lost if you close this item without saving.'
    })

    switch (result) {
      case 2:
        return 'dontsave'
      case 1:
        return 'cancel'
      case 0:
        return 'save'
      default:
    }
  }

  showOpenFile (defaultPath, filters) {
    var files = dialog.showOpenDialog(remote.getCurrentWindow(), {
      defaultPath: defaultPath,
      filters: filters,
      properties: ['openFile', 'createDirectory']
    })
    if (files) {
      return files[0]
    } else {
      return null
    }
  }

  showOpenDirectory (defaultPath, filters) {
    var files = dialog.showOpenDialog(remote.getCurrentWindow(), {
      defaultPath: defaultPath,
      filters: filters,
      properties: ['openDirectory', 'createDirectory']
    })
    if (files) {
      return files[0]
    } else {
      return null
    }
  }

  showSaveDialog () {
    var fileName = dialog.showSaveDialog(remote.getCurrentWindow())
    if (fileName) {
      return fileName
    } else {
      return null
    }
  }
}

module.exports = Dialog
