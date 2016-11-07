class DropdownDialog {
  constructor (title, options, placeholder, callback) {
    this.callback = callback

    var container = document.createElement('div')
    container.classList.add('new-data-dialog')

    var header = document.createElement('div')
    header.classList.add('new-data-dialog-header')
    header.innerHTML = title

    container.appendChild(header)

    var select = document.createElement('select')
    select.classList.add('new-data-dialog-input')
    select.value = placeholder

    for (var i = 0; i < options.length; i++) {
      var opt = new Option(options[i], options[i])
      select.options.add(opt)
    }

    this.select = select

    container.appendChild(select)

    document.addEventListener('keydown', this, false)
    document.addEventListener('click', this)

    document.body.appendChild(container)

    this.element = container

    select.focus()
  }

  remove () {
    this.element.parentNode.removeChild(this.element)
    document.removeEventListener('click', this)
    document.removeEventListener('contextmenu', this)
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
      case 'contextmenu':
        this.onClick(e)
        break
    }
  }

  onKeyDown (e) {
    var c = e.keyCode
    if (c === 13) {
      this.callback(this.select.value)
      this.remove()
    } else if (c === 27) {
      this.callback(false)
      this.remove()
    }
  }

  onClick (e) {
    if (e.target && e.target !== this.element && e.target.parentNode !== this.element) {
      this.remove()
    }
  }
}

module.exports = DropdownDialog
