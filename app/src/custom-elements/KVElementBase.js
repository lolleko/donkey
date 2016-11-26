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

}

module.exports = KVElementBase
