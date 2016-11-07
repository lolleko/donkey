const path = require('path')

class FileValue extends BaseValue {
  createdCallback () {
    this.classList.add('value')
    this.classList.add('file-value')
    this.classList.add('value-with-button')

    var input = document.createElement('autocomplete-input')
    // TODO fix with webcomponents v1
    input.classList.add('value-input')
    input.classList.add('file-value-input')

    input.addEventListener('input', this, false)

    var openButton = document.createElement('span')
    openButton.classList.add('file-value-button')
    openButton.classList.add('input-button')
    openButton.classList.add('octicon')

    openButton.addEventListener('click', this, false)

    this.appendChild(input)
    this.input = input

    this.appendChild(openButton)
    this.button = openButton
  }

  attachedCallback () {
    this.input.values = this.options.values || []
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
    var file = donkey.dialog.showOpenFile(this.defaultPath || this.options.defaultPath, this.options.filters)
    if (file) {
      this.value = this.modfifyResultPath(file)
    }
  }

  modfifyResultPath (filePath) {
    if (this.options.filenamePathPrefix) {
      var filePathArr = filePath.split(path.sep)
      while (filePathArr.length > 0) {
        if (filePathArr.shift() === this.options.filenamePathPrefix) {
          return path.posix.join(this.options.filenamePathPrefix, ...filePathArr)
        }
      }
    }
    // convert to unix format
    return path.posix.normalize(filePath)
  }
}
module.exports = document.registerElement('file-value', FileValue)
