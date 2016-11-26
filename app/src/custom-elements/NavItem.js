const kvpath = require('./../kvpath')
const remote = require('electron').remote
const dialog = remote.dialog

class NavItem extends HTMLElement {

  createdCallback () {
    this.addEventListener('click', this.onClick)
    this.addEventListener('contextmenu', this.onContextMenu)
    this.classList.add('nav-item')
    this.depth = 0
  }

  attachedCallback () {
    var header = document.createElement('div')
    header.classList.add('nav-item-header')

    if (this.depth < 2) {
      var expander = document.createElement('span')
      expander.classList.add('octicon')
      expander.classList.add('octicon-chevron-right')
      expander.classList.add('nav-item-expand')
      header.appendChild(expander)

      this.expander = expander
    } else {
      this.classList.add('nav-item-last')
    }

    if (this.depth === 0) {
      var iconName = donkey.lang.getIconForFile(this.dataset.path)
      var icon = document.createElement('span')
      icon.classList.add('octicon')
      icon.classList.add(iconName)
      icon.classList.add('nav-item-icon')
      header.appendChild(icon)
    }

    var name = document.createElement('span')
    name.innerText = kvpath.basename(this.dataset.path)
    this.name = kvpath.basename(this.dataset.path)

    header.appendChild(name)

    this.appendChild(header)

    this.header = header

    var inner = document.createElement('div')
    inner.classList.add('nav-item-inner')
    inner.style.display = 'none'
    this.expanded = false

    this.inner = inner

    for (var [key, value] of this.data) {
      if (typeof value !== 'string' && this.depth < 2) {
        var navItem = document.createElement('nav-item')
        navItem.dataset.path = kvpath.join(this.dataset.path, key)
        navItem.data = value
        navItem.depth = this.depth + 1
        inner.appendChild(navItem)
      }
    }

    this.appendChild(inner)
  }

  get size () {
    var size = this.inner.children.length
    for (var i = 0; i < this.inner.children.length; i++) {
      size = this.inner.children[i].size + size
    }
    return size
  }

  get deepSize () {
    return this.data.deepSize
  }

  search (searchString) {
    var oneFound = false
    if (this.name.includes(searchString)) {
      oneFound = true
    }
    for (var i = 0; i < this.inner.children.length; i++) {
      var child = this.inner.children[i]
      if (child.search(searchString)) {
        oneFound = true
      }
    }
    if (!oneFound) {
      this.style.display = 'none'
      this.collapse()
    } else {
      this.style.display = ''
      this.expand()
    }
    return oneFound
  }

  expand () {
    if (this.expander) {
      this.inner.style.display = 'block'
      this.expander.classList.remove('octicon-chevron-right')
      this.expander.classList.add('octicon-chevron-down')
      this.classList.add('nav-item-expanded')
      this.expanded = true
    }
  }

  collapse () {
    if (this.expander) {
      this.inner.style.display = 'none'
      this.expander.classList.remove('octicon-chevron-down')
      this.expander.classList.add('octicon-chevron-right')
      this.classList.remove('nav-item-expanded')
      this.expanded = false
    }
  }

  open () {
    var warning = -1
    const LIMIT = 1250
    if (this.deepSize > LIMIT) {
      warning = dialog.showMessageBox(remote.getCurrentWindow(), {
        type: 'warning',
        buttons: ['Cancel', 'Open'],
        defaultId: 0,
        cancelId: 0,
        title: 'Warning!',
        message: 'Warning opening large parent!',
        detail: 'This parent key has more (' + this.deepSize + ') than ' + LIMIT + ' subkeys, opening it may cause lags.\nDo you wish to continue?'
      })
    }
    // warning ignored or no warning fired
    if (warning === 1 || warning === -1) {
      donkey.nav.addTab(this.dataset.path)
    }
  }

  onClick (e) {
    if (this.expander && e.target === this.expander) {
      if (this.expanded) {
        this.collapse()
      } else {
        this.expand()
      }
    } else if (e.target === this.header || e.target.parentNode === this.header) {
      this.open()
    }
  }

  onContextMenu (e) {
    donkey.lang.openFileContextMenu(this)
    e.stopPropagation()
  }

}

module.exports = document.registerElement('nav-item', NavItem)
