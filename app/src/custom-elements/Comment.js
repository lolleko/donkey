const KVElementBase = require('./KVElementBase')

class Comment extends KVElementBase {

  createdCallback () {
    super.createdCallback()
    this.classList.add('kv-element')
    this.classList.add('kv-data-container')
    this.innerHTML = ''
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

    this.textarea.style.height = this.textarea.scrollHeight + 'px'
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

  focus () {
    this.textarea.focus()
  }

  select () {
    this.textarea.select()
  }

  onInput (e) {
    this.value = this.textarea.value
    this.textarea.style.height = 'auto'
    this.textarea.style.height = this.textarea.scrollHeight + 'px'
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
