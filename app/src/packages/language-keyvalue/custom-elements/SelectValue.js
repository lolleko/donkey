class SelectValue extends donkey.basevalue {

  createdCallback () {
    this.classList.add('dropdown-container')

    var input = document.createElement('autocomplete-input')
    input.classList.add('select-value-input')
    input.addEventListener('input', this, false)
    // TODO fix once autocomplete-input is reimplemented
    input.input.addEventListener('blur', this, false)
    input.input.addEventListener('keydown', this, false)
    input.input.classList.add('dropdown-input')
    input.input.classList.add('value-input')
    input.minChars = 0

    this.input = input

    var expand = document.createElement('span')
    expand.classList.add('octicon')
    expand.classList.add('select-value-expander')
    expand.classList.add('dropdown-expand')

    expand.addEventListener('click', this, false)

    this.appendChild(input)
    this.appendChild(expand)
  }

  attachedCallback () {
    this.input.values = this.options.values
    this.trapSpace = true
  }

  expand () {
    this.input.evaluate(true)
    // TODO redo when autocomplete-input can be implemented as HTMLInputElement subclass
    this.input.focus()
    this.classList.add('select-value-focus')
    this.expanded = true
    this.trapSpace = false
  }

  hide () {
    this.classList.remove('select-value-focus')
    this.expanded = false
    this.trapSpace = true
  }

  handleEvent (e) {
    super.handleEvent(e)
    switch (e.type) {
      case 'click':
        this.onClick(e)
        break
      case 'blur':
        this.onBlur(e)
        break
      case 'keydown':
        this.onKeyDown(e)
        break
    }
  }

  onClick (e) {
    if (!this.expanded) {
      this.expand()
    } else {
      this.hide()
    }
  }

  onBlur (e) {
    this.hide()
  }

  onKeyDown (e) {
    if (e.keyCode === 32 && this.trapSpace) {
      this.expand()
      e.preventDefault()
    } else if (e.keyCode === 27) {
      this.hide()
    }
  }

}

module.exports = document.registerElement('select-value', SelectValue)
