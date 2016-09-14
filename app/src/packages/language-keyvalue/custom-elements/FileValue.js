const app = require('electron').remote.app

class FileValue extends donkey.basevalue {
  createdCallback () {
    this.classList.add('file-value')

    var input = document.createElement('input')
    input.classList.add('value-input')
    input.classList.add('file-value-input')
    input.classList.add('dropdown-input')

    input.addEventListener('input', this, false)

    var openButton = document.createElement('span')
    openButton.classList.add('file-value-button')
    openButton.classList.add('dropdown-expand')
    openButton.classList.add('octicon')

    openButton.addEventListener('click', this, false)

    this.appendChild(input)
    this.input = input

    this.appendChild(openButton)
    this.button = openButton
  }

  attachedCallback () {
    this.defaultPath = this.options.defaultPath || app.getPath('home')
    this.filters = this.options.filters
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
    var file = donkey.dialog.showOpenFile(this.defaultPath, this.filters)
    if (file) {
      this.value = this.modfifyResultPath(file)
    }
  }

  modfifyResultPath (path) {
    return path
  }

}
module.exports = document.registerElement('file-value', FileValue)
