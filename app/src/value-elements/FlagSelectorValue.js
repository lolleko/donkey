class FlagSelectorValue extends BaseValue {

  createdCallback () {
    this.classList.add('value')
    this.classList.add('dropdown-container')

    var input = document.createElement('input')
    input.classList.add('flag-selector-value-input')
    input.classList.add('value-input')
    input.classList.add('dropdown-input')
    input.addEventListener('input', this, false)
    input.addEventListener('keydown', this, false)

    this.input = input

    var expand = document.createElement('span')
    expand.classList.add('octicon')
    expand.classList.add('flag-selector-value-expand')
    expand.classList.add('input-button')
    expand.classList.add('dropdown-expand')

    expand.addEventListener('click', this, false)

    this.appendChild(input)
    this.appendChild(expand)

    var items = document.createElement('div')
    items.classList.add('flag-selector-value-items')
    items.classList.add('dropdown-select')
    items.style.display = 'none'
    items.style.position = 'absolute'

    this.items = items

    this.appendChild(items)
  }

  attachedCallback () {
    this.trapSpace = true

    this.rebuildFlags()
  }

  set value (value) {
    if (value !== this.input.value) {
      this.input.value = value
      if (this.preventNextFlagRebuild) {
        this.preventNextFlagRebuild = false
      } else {
        this.rebuildFlags()
      }
    }
    this.emitValueChange(value)
  }

  get value () {
    return this.input.value
  }

  rebuildFlags () {
    this.selected = this.input.value.replace(/\s+/g, '').split('|')

    this.items.innerHTML = ''

    for (var i = 0; i < this.options.values.length; i++) {
      var flag = this.options.values[i]

      var item = document.createElement('label')
      item.classList.add('flag-selector-value-item')

      var itemCheckbox = document.createElement('input')
      itemCheckbox.classList.add('flag-selector-value-item-checkbox')
      itemCheckbox.type = 'checkbox'
      itemCheckbox.value = flag
      itemCheckbox.addEventListener('change', this, false)

      if (this.selected.includes(flag)) {
        itemCheckbox.checked = true
      }

      item.appendChild(itemCheckbox)

      var itemLabel = document.createElement('span')
      itemLabel.classList.add('flag-selector-value-item-label')
      itemLabel.innerHTML = flag

      item.appendChild(itemLabel)

      this.items.appendChild(item)
    }
  }

  removeInvalidFlags () {
    this.selected = this._element.button.value.replace(/\s+/g, '').split('|')

    // remove invalid flags
    for (var i = 0; i < this.selected.length; i++) {
      if (!this._options.flags.includes(this.selected[i])) {
        this.selected.splice(i, 1)
        this.changeValue()
        this._element.button.value = this._value
      }
    }
  }

  changeValue () {
    var result = ''
    for (var i = 0; i < this.selected.length; i++) {
      if (i !== 0) {
        result = result + ' | ' + this.selected[i]
      } else {
        result = this.selected[i]
      }
    }
    this.preventNextFlagRebuild = true
    this.value = result
    this.input.focus()
  }

  expand () {
    this.items.style.display = ''
    this.expanded = true
    this.input.focus()
    document.addEventListener('click', this)
    this.classList.add('flag-selector-value-focus')
    this.input.classList.add('flag-selector-value-input-focus')
    this.trapSpace = false
  }

  hide () {
    this.items.style.display = 'none'
    this.expanded = false
    document.removeEventListener('click', this)
    this.classList.remove('flag-selector-value-focus')
    this.input.classList.remove('flag-selector-value-input-focus')
    this.trapSpace = true
  }

  handleEvent (e) {
    super.handleEvent(e)
    switch (e.type) {
      case 'click':
        this.onClick(e)
        break
      case 'change':
        this.onChange(e)
        break
      case 'keydown':
        this.onKeyDown(e)
        break
    }
  }

  onClick (e) {
    if (this.items !== e.target && this.items !== e.target.parentNode && this.items !== e.target.parentNode.parentNode) {
      if (!this.expanded) {
        this.expand()
        e.stopPropagation()
      } else {
        this.hide()
      }
    }
  }

  onChange (e) {
    if (e.target.checked) {
      this.selected.push(e.target.value)
      this.changeValue()
    } else {
      var i = this.selected.indexOf(e.target.value)
      this.selected.splice(i, 1)
      this.changeValue()
    }
  }

  onInput (e) {
    this.rebuildFlags()
    this.value = this.input.value
  }

  onKeyDown (e) {
    if (this.trapSpace && e.keyCode === 32) {
      this.expand()
      e.preventDefault()
    } else if (e.keyCode === 27) {
      this.hide()
    }
  }
}
module.exports = document.registerElement('flag-selector-value', FlagSelectorValue)
