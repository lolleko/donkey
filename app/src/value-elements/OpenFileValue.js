const fs = require('fs')

class OpenFileValue extends donkey.basevalue {
  createdCallback () {
    this.classList.add('open-file-value')
    this.classList.add('value-with-button')

    var input = document.createElement('autocomplete-input')
    // TODO webcomponents v1 fix
    input.classList.add('value-input')

    input.addEventListener('input', this, false)

    var openButton = document.createElement('span')
    openButton.classList.add('input-button')
    openButton.classList.add('octicon')

    openButton.addEventListener('click', this, false)

    this.appendChild(input)
    this.input = input

    this.appendChild(openButton)
    this.button = openButton
  }

  attachedCallback () {
    if (this.options.buttonIcon) {
      this.button.classList.add(this.options.buttonIcon)
    } else {
      this.button.classList.add('octicon-pencil')
    }
  }

  // overwrite in subclasses
  getFileToOpen () {
    return this.value
  }

  handleEvent (e) {
    super.handleEvent(e)
    switch (e.type) {
      case 'click':
        this.onClick(e)
        break
    }
  }

  onClick (e) {
    var fileToOpen = this.getFileToOpen()

    // Make sure file exists
    try {
      fs.statSync(fileToOpen).isFile()
    } catch (e) {
      // File doesn't exist shoudl we create it?
      var create = donkey.dialog.showSimpleQuestion('The file you are trying to open does not exist. Do you want to create it?', 'You are trying to open \'' + fileToOpen + '\'.')
      if (!create) {
      // don' t create file
        return
      }
      try {
        // try to create file
        fs.writeFileSync(fileToOpen, '', 'utf8')
      } catch (e) {
        // error while creating (invalid path)
        donkey.dialog.showSimpleError('Failed to create File!', 'Unable to create \'' + fileToOpen + '\'.')
        return
      }
    }

    var openCmd
    switch (process.platform) {
      case 'darwin':
        openCmd = 'open'
        break
      case 'win32':
        openCmd = 'start'
        break
      case 'win64':
        openCmd = 'start'
        break
      default:
        openCmd = 'xdg-open'
        break
    }

    var exec = require('child_process').exec

    exec(openCmd + ' ' + fileToOpen)
  }
}
module.exports = document.registerElement('open-file-vlaue', OpenFileValue)
