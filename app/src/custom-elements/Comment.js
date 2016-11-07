class Comment extends HTMLElement {
  createdCallback () {
    this.classList.add('kv-element')
    this.classList.add('kv-data-container')
    this.innerHTML = ''
    this.addEventListener('contextmenu', this.onContextMenu)
    this.addEventListener('input', this.onInput)
  }

  attachedCallback () {
    this.innerHTML = ''
    var commentHeader = document.createElement('span')
    commentHeader.innerHTML = '//'
    commentHeader.classList.add('comment-header')
    this.appendChild(commentHeader)

    var textarea = document.createElement('textarea')
    this.valueElement = this
    textarea.classList.add('comment-textarea')
    this.appendChild(textarea)
    this.textarea = textarea
    this.textarea.value = this.value
  }

  set value (value) {
    if (this.textarea && value !== this.textarea.value) {
      this.textarea.value = value
    }
    this.dataset.value = value
  }

  get value () {
    return this.dataset.value
  }

  get parentKVElement () {
    if (this.parentElement === donkey.editor) {
      return this.parentElement
    } else {
      return this.previousElementSibling || this.parentElement.parentElement
    }
  }

  insert (element) {
    var inserted
    if (element.nodeName === '#document-fragment') {
      inserted = [].slice.call(element.children)
      this.parentNode.insertBefore(element, this.nextSibling)
    } else {
      inserted = this.parentNode.insertBefore(element, this.nextSibling)
    }
    return inserted
  }

  remove () {
    return this.parentNode.removeChild(this)
  }

  focus () {
    this.textarea.focus()
  }

  select () {
    this.textarea.select()
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

  onInput (e) {
    this.value = this.textarea.value
  }

  onContextMenu (e) {
    donkey.lang.openEditorContextMenu(this)
    e.stopPropagation()
  }

  attributeChangedCallback (attrName, oldVal, newVal) {
    if (this.preventCallback) {
      this.preventCallback = false
    } else {
      if (oldVal && attrName === 'data-value') {
        donkey.commands.exec('valuechange', this, oldVal)
      }
    }
  }
}

module.export = document.registerElement('donkey-comment', Comment)