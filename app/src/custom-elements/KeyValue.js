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
      var keyElement = document.createElement('base-key')
      this.appendChild(keyElement)
      keyElement.key = this.key
      this.keyElement = keyElement
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

      this.appendChild(value)
      value.value = this.valueElement.value
      this.valueElement = value
    }
  }

  set key (key) {
    this.keyElement.key = key
  }

  get key () {
    return this.keyElement.key
  }

  set value (value) {
    this.valueElement.value = value
  }

  get value () {
    return this.valueElement.value
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

  attributeChangedCallback (attrName, oldVal, newVal) {
    super.attributeChangedCallback(attrName, oldVal, newVal)
    if (attrName === 'data-key') {
      this.rebuildValue()
    }
  }

}

module.exports = document.registerElement('key-value', KeyValue)
