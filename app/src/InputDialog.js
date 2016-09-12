const remote = require('electron').remote
const dialog = remote.dialog

class InputDialog {
  constructor (title, detail, placeholder, callback) {
    this.callback = callback

    var container = document.createElement('div')
    container.classList.add('new-data-dialog')

    var header = document.createElement('div')
    header.classList.add('new-data-dialog-header')
    header.innerHTML = title

    container.appendChild(header)

    var detailText = document.createElement('div')
    detailText.classList.add('new-data-dialog-detail')
    detailText.innerHTML = detail

    container.appendChild(detailText)

    var input = document.createElement('input')
    input.classList.add('new-data-dialog-input')
    input.value = placeholder
    document.addEventListener('keydown', this, false)

    this.input = input

    container.appendChild(input)

    document.addEventListener('click', this)

    document.body.appendChild(container)

    this.element = container

    input.focus()
  }

  remove () {
    this.element.parentNode.removeChild(this.element)
    document.removeEventListener('click', this)
    document.removeEventListener('keydown', this)
    this.element = null
    this.instance = null
  }

  handleEvent (e) {
    switch (e.type) {
      case 'keydown':
        this.onKeyDown(e)
        break
      case 'click':
        this.onClick(e)
        break
    }
  }

  onKeyDown (e) {
    var c = e.keyCode
    if (c === 13) {
      this.callback(this.input.value)
      this.remove()
    } else if (c === 27) {
      this.callback()
      this.remove()
    }
  }

  onClick (e) {
    if (e.target && e.target !== this.element && e.target.parentNode !== this.element) {
      this.remove()
    }
  }

  static show (title, detail, placeholder, callback) {
    this.instance = new InputDialog(title, detail, placeholder, callback)
  }

  static showSimpleWarning (message, detail, cancelByDefault) {
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

  static showCloseWarning (itemName) {
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
}

module.exports = InputDialog
