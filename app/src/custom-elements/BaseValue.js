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
    if (value !== this.input.value) {
      this.input.value = value
    }
    this.dataset.value = value
  }

  get value () {
    return this.dataset.value
  }

  focus () {
    if (this.input) {
      this.input.focus()
    }
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

  attributeChangedCallback (attrName, oldVal, newVal) {
    if (this.preventCallback) {
      this.preventCallback = false
    } else {
      if (oldVal && attrName === 'data-value') {
        donkey.commands.exec('valuechange', this.parentNode, oldVal)
      }
    }
  }

}

module.exports = document.registerElement('base-value', BaseValue)
