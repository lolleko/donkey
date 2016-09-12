const BaseValue = require('./BaseValue')

class CheckBoxValue extends BaseValue {
  createdCallback () {
    this.classList.add('checkbox-value')

    var checkbox = document.createElement('input')
    checkbox.classList.add('checkbox-value-input')
    checkbox.type = 'checkbox'

    checkbox.addEventListener('change', this, false)

    var label = document.createElement('label')
    label.classList.add('checkbox-value-label')

    var labelText = document.createElement('span')

    label.appendChild(checkbox)
    label.appendChild(labelText)
    this.appendChild(label)

    this.labelText = labelText
    this.input = checkbox
  }

  set value (value) {
    if (this.options.on === undefined) {
      this.options.on = '1'
    }

    if (this.options.off === undefined) {
      this.options.off = '0'
    }
    if (value === this.options.off) {
      this.input.checked = false
      this.labelText.innerHTML = value
      this.dataset.value = value
    } else {
      this.input.checked = true
      this.labelText.innerHTML = this.options.on
      this.dataset.value = this.options.on
    }
  }

  // same as in super but required because not inherited correctly?
  // or setter and getter can only be inherited as pair?
  get value () {
    return this.dataset.value
  }

  handleEvent (e) {
    switch (e.type) {
      case 'change':
        this.onChange(e)
        break
    }
  }

  onChange (e) {
    if (this.input.checked) {
      this.value = this.options.on
    } else {
      this.value = this.options.off
    }
  }

}

module.exports = document.registerElement('checkbox-value', CheckBoxValue)
