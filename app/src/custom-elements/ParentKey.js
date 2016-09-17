class ParentKey extends HTMLElement {

  createdCallback () {
    this.addEventListener('contextmenu', this, false)

    if (this.firstChild && (this.firstChild.tagName === 'AUTOCOMPLETE-INPUT' || this.firstChild.tagName === 'INPUT')) {
      // remove input if exists (after ciopy paste)
      this.removeChild(this.firstChild)
    }
    if (this.firstChild && (this.firstChild.tagName === 'DIV')) {
      // remove inner if exists (after ciopy paste)
      this.removeChild(this.firstChild)
    }
    var input
    if (donkey.lang.hasParentKeySuggestions()) {
      input = document.createElement('autocomplete-input')
      input.values = donkey.lang.getParentKeySuggestions.bind(donkey.lang)
    } else {
      input = document.createElement('input')
    }
    input.classList.add('parent-key-input')
    input.classList.add('key')

    input.addEventListener('input', this, false)
    this.input = input
    this.keyElement = this
    this.insertBefore(input, this.firstChild)

    var inner = document.createElement('div')
    inner.classList.add('parent-key-inner')
    this.appendChild(inner)
    this.inner = inner
  }

  attachedCallback () {
    if (this.data) {
      for (var [key, value] of this.data) {
        if (typeof value === 'string') {
          var keyValue = document.createElement('key-value')
          keyValue.key = key
          keyValue.value = value
          this.inner.appendChild(keyValue)
        } else {
          var parentKey = document.createElement('parent-key')
          parentKey.key = key
          parentKey.data = value
          this.inner.appendChild(parentKey)
        }
      }

      delete this.data
    }
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

  get subKVElements () {
    return this.inner.children
  }

  insert (element) {
    var inserted
    if (element.nodeName === '#document-fragment') {
      inserted = [].slice.call(element.children)
      this.insertBefore(element, this.firstChild.nextSibling)
    } else {
      inserted = this.insertBefore(element, this.firstChild.nextSibling)
    }
    return inserted
  }

  remove () {
    return this.parentNode.removeChild(this)
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
      case 'contextmenu':
        this.onContextMenu(e)
        break
    }
  }

  onInput (e) {
    this.key = e.target.value
  }

  onContextMenu (e) {
    donkey.lang.openEditorContextMenu(this)
    e.stopPropagation()
  }

  attributeChangedCallback (attrName, oldVal, newVal) {
    if (this.preventCallback) {
      this.preventCallback = false
    } else {
      if (oldVal && attrName === 'data-key') {
        donkey.commands.exec('keychange', this, oldVal)
      }
    }
  }
}

module.exports = document.registerElement('parent-key', ParentKey)
