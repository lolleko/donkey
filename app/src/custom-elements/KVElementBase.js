class KVElementBase extends HTMLElement {

  createdCallback () {
    this.addEventListener('contextmenu', this.onContextMenu)
  }

  get parentKVElement () {
    if (this.parentElement === donkey.editor) {
      return this.parentElement
    } else {
      return this.previousElementSibling || this.parentElement.parentElement
    }
  }

  get value () {

  }

  set value (value) {

  }

  get key () {

  }

  set key (key) {

  }

  insert () {

  }

  append () {

  }

  remove () {
    return this.parentNode.removeChild(this)
  }

  moveUp () {
    if (this.previousSibling) {
      this.parentNode.insertBefore(this, this.previousSibling)
    }
    this.focus()
  }

  moveDown () {
    if (this.nextSibling) {
      this.parentNode.insertBefore(this, this.nextSibling.nextSibling)
    } else {
      this.parentNode.appendChild(this)
    }
    this.focus()
  }

  select () {

  }

  focus () {

  }

  onContextMenu (e) {
    donkey.lang.openEditorContextMenu(this)
    e.stopPropagation()
  }

  attributeChangedCallback (attrName, oldVal, newVal) {
    if (this.preventChangeCallback) {
      this.preventChangeCallback = false
      return
    }
    if (oldVal && oldVal !== newVal) {
      if (attrName === 'data-value') {
        donkey.commands.exec('valuechange', this, oldVal)
      }
      if (attrName === 'data-key') {
        donkey.commands.exec('keychange', this, oldVal)
      }
    }
  }

}

module.exports = KVElementBase
