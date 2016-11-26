const KVElementBase = require('./KVElementBase')

class KeyValue extends KVElementBase {

  createdCallback () {
    super.createdCallback()
    this.classList.add('kv-element')
    this.classList.add('kv-data-container')
    this.innerHTML = ''

    // proxys for element creation
    this.keyElement = {}
    this.valueElement = {}
  }

  attachedCallback () {
    if (!this.keyElement.tagName) {
      var key
      key = document.createElement('base-key')
      key.key = this.keyElement.key

      this.appendChild(key)
      this.keyElement = key
    }

    if (!this.valueElement.tagName) {
      var valueElement = donkey.lang.getCustomValueElement(this.key)
      var value
      if (valueElement) {
        value = document.createElement(valueElement[0])
        value.options = valueElement[1]
      } else {
        value = document.createElement('base-value')
      }
      value.value = this.valueElement.value

      this.appendChild(value)

      this.valueElement = value
    }
  }

  set key (key) {
    this.keyElement.key = key
  }

  get key () {
    return this.keyElement.dataset.key
  }

  set value (value) {
    this.valueElement.value = value
  }

  get value () {
    return this.valueElement.dataset.value
  }

  insert (element) {
    var inserted
    if (element.nodeName === '#document-fragment') {
      inserted = [].slice.call(element.children)
      this.parentNode.insertBefore(element, this.nextSibling)
    } else {
      inserted = this.parentNode.insertBefore(element, this.nextElementSibling)
    }
    return inserted
  }

  focus () {
    this.keyElement.focus()
  }

  select () {
    this.keyElement.select()
  }

  rebuildValue () {
    var valueElement = donkey.lang.getCustomValueElement(this.key)
    var value
    if (valueElement) {
      value = document.createElement(valueElement[0])
      value.options = valueElement[1]
      this.appendChild(value)
    } else if (this.valueElement.tagName !== 'BASE-VALUE') {
      value = document.createElement('base-value')
    }
    if (value) {
      var oldValue = this.valueElement.value
      this.removeChild(this.valueElement)
      value.value = oldValue
      value.classList.add('value')
      this.appendChild(value)
      this.valueElement = value
    }
  }

}

module.exports = document.registerElement('key-value', KeyValue)
