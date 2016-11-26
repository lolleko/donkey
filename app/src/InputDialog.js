class InputDialog {
  constructor (options, callback) {
    this.callback = callback
    this.options = options

    var container = document.createElement('div')
    container.classList.add('new-data-dialog')

    var header = document.createElement('div')
    header.classList.add('new-data-dialog-header')
    header.innerHTML = options.title || ''

    container.appendChild(header)

    var detailText = document.createElement('div')
    detailText.classList.add('new-data-dialog-detail')
    detailText.innerHTML = options.detail || ''

    container.appendChild(detailText)

    var input
    if (options.type === 'kveditor') {
      input = document.createElement('donkey-editor')
      input.build(options.data || new VDFMap())
      input.classList.add('new-data-dialog-input')
      input.classList.add('new-data-dialog-kveditor')
      this.prevEditor = donkey.editor
      donkey.editor = input
    } else if (options.type === 'dropdown') {
      input = document.createElement('select')
      input.classList.add('new-data-dialog-input')
      input.classList.add('new-data-dialog-dropdown')
      input.value = options.placeholder || ''

      for (var i = 0; i < options.choices.length; i++) {
        var opt = new Option(options.choices[i], options.choices[i])
        input.options.add(opt)
      }
    } else if (options.type === 'textarea') {
      input = document.createElement('textarea')
      input.classList.add('new-data-dialog-input')
      input.classList.add('new-data-dialog-textarea')
      input.value = options.placeholder || ''
    } else {
      input = document.createElement('input')
      input.classList.add('new-data-dialog-input')
      input.value = options.placeholder || ''
    }

    this.input = input

    container.appendChild(input)

    document.addEventListener('keydown', this, false)
    document.addEventListener('click', this)

    document.body.appendChild(container)

    this.element = container

    input.focus()
  }

  remove () {
    if (this.prevEditor) {
      donkey.editor = this.prevEditor
    }
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
      this.callback(this.input.value)
      this.remove()
    } else if (c === 27) {
      this.callback(false)
      this.remove()
    }
  }

  onClick (e) {
    var found = false
    var node = e.target
    while (node != null) {
      if (node === this.element) {
        return true
      }
      node = node.parentNode
    }

    if (!found) {
      this.remove()
    }
  }
}

module.exports = InputDialog
