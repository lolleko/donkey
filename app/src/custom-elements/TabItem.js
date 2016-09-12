const kvpath = require('./../kvpath')
const InputDialog = require('./../InputDialog')

class TabItem extends HTMLElement {

  createdCallback () {
    this.addEventListener('click', this.onClick)
    this.classList.add('tab-item')
    this.data = new Map()
    this.editor = document.createElement('donkey-editor')
    this.editor.tabItem = this
  }

  attachedCallback () {
    this.filePath = kvpath.filepath(this.path)

    var title = document.createElement('div')
    title.classList.add('tab-item-title')
    title.innerText = kvpath.basename(this.path)
    this.appendChild(title)

    var closeBtn = document.createElement('div')
    closeBtn.classList.add('octicon')
    closeBtn.classList.add('octicon-x')
    closeBtn.classList.add('tab-item-close')
    this.appendChild(closeBtn)

    this.closeBtn = closeBtn

    this.editor.path = this.path
    this.editor.build()
    document.querySelector('.content').appendChild(this.editor)

    this.show()
  }

  set modified (value) {
    if (value) {
      this.closeBtn.classList.remove('octicon-x')
      this.closeBtn.classList.add('octicon-primitive-dot')
    } else {
      this.closeBtn.classList.add('octicon-x')
      this.closeBtn.classList.remove('octicon-primitive-dot')
    }
  }

  get modified () {
    return this.closeBtn.classList.contains('octicon-primitive-dot')
  }

  hide () {
    this.editor.style.display = 'none'
    this.classList.remove('tab-item-active')
  }

  show () {
    this.editor.style.display = ''
    this.classList.add('tab-item-active')
  }

  close () {
    if (this.modified) {
      var shouldSave = InputDialog.showCloseWarning(kvpath.basename(this.path))
      switch (shouldSave) {
        case 'save':
          this.editor.save()
        case 'dontsave':
          this.editor.close()
          donkey.nav.removeTab(this.path)
          this.parentNode.removeChild(this)
          break
        case 'canel':
          return
      }
    } else {
      this.editor.close()
      donkey.nav.removeTab(this.path)
      this.parentNode.removeChild(this)
    }
  }

  onClick (e) {
    if (e.target === this.closeBtn) {
      this.close()
    } else {
      donkey.nav.selectTab(this.path)
    }
  }
}

module.exports = document.registerElement('tab-item', TabItem)
