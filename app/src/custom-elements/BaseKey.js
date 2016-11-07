/**
 * Base Key this element is used to represent a key of a KeyValue pair.
 * It features autocompletion if avalaible for the current language adn file.
 */
class BaseKey extends HTMLElement {

  createdCallback () {
    var input
    if (donkey.lang.hasKeySuggestions()) {
      input = document.createElement('autocomplete-input')
      input.values = donkey.lang.getKeySuggestions.bind(donkey.lang)
    } else {
      input = document.createElement('input')
    }
    input.addEventListener('input', this, false)
    input.classList.add('key-input')
    this.classList.add('key')
    this.appendChild(input)
    this.input = input
  }

  set key (key) {
    if (key !== this.input.value) {
      this.input.value = key
    }
    this.dataset.key = key
  }

  get key () {
    return this.dataset.key
  }

  focus () {
    this.input.focus()
  }

  select () {
    this.input.select()
  }

  handleEvent (e) {
    switch (e.type) {
      case 'input':
        this.onInput(e)
        break
    }
  }

  onInput (e) {
    this.key = e.target.value
  }

  attributeChangedCallback (attrName, oldVal, newVal) {
    if (this.preventCallback) {
      this.preventCallback = false
    } else {
      if (oldVal && attrName === 'data-key') {
        donkey.commands.exec('keychange', this.parentNode, oldVal)
      }
    }

    if (oldVal) {
      this.parentNode.rebuildValue()
    }
  }

}

module.exports = document.registerElement('base-key', BaseKey)
