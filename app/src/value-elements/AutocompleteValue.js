/**
 * Simple autocomplete value,
 * that can be used to show suggestion while inputing a value
 */
class AutocompleteValue extends window.donkey.basevalue {

  createdCallback () {
    var input = document.createElement('autocomplete-input')
    // TODO refactor once webcomponents v1
    input.classList.add('value-input')
    input.addEventListener('input', this, false)

    this.appendChild(input)
    this.input = input
  }

  attachedCallback () {
    this.input.values = this.options.values
  }

}

module.exports = document.registerElement('autocomplete-value', AutocompleteValue)
