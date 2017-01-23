/**
 * Base Value this element is used to represent a value of a KeyValue pair.
 * Custom Value Elements should derive from this class.
 */
class BaseValue extends HTMLElement {

  createdCallback () {
    var input = document.createElement('input')
    input.addEventListener('input', this, false)
    input.classList.add('value-input')
    this.classList.add('value')
    this.appendChild(input)
    this.input = input
  }

  set value (value) {
    // prevent event loop
    if (value !== this.input.value) {
      this.input.value = value
    }
    this.emitValueChange(value)
  }

  get value () {
    return this.input.value
  }

  focus () {
    if (this.input) {
      this.input.focus()
    }
  }

  emitValueChange (value) {
    this.parentElement.dataset.value = value
  }

  handleEvent (e) {
    switch (e.type) {
      case 'input':
        this.onInput(e)
        break
    }
  }

  onInput (e) {
    this.value = e.target.value
  }
}

module.exports = document.registerElement('base-value', BaseValue)
