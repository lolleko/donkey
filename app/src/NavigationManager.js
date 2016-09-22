const kvpath = require('./kvpath')
const path = require('path')

class NavigationManager {
  constructor () {
    this.nav = document.querySelector('.nav-inner')
    this.footerPath = document.querySelector('.footer-current-path')
    this.footerSelect = document.querySelector('.footer-select-lang')
    this.footerSelect.addEventListener('input', function (e) {
      donkey.lang.setActiveCategory(this.value)
      donkey.editor.build()
    }, false)
    this.tabBar = document.querySelector('.tab-bar')
    this.searchInput = document.querySelector('.search-input')
    this.searchInput.addEventListener('input', (e) => {
      this.search(e.target.value)
    })
    this.openTabs = {}
    this.activeTab
  }

  addFile (file) {
    var navItem = document.createElement('nav-item')
    navItem.dataset.path = file.path
    navItem.data = file.data
    var pointer = this.nav.firstElementChild
    while (pointer && pointer.name < file.name) {
      pointer = pointer.nextElementSibling
    }
    if (!pointer) {
      this.nav.appendChild(navItem)
    } else {
      this.nav.insertBefore(navItem, pointer)
    }
  }

  rebuildTreeView () {
    var expandedNodes = document.querySelectorAll('.nav-item-expanded')
    var expandedPaths = []
    for (var i = 0; i < expandedNodes.length; i++) {
      expandedPaths.push(expandedNodes[i].dataset.path)
    }
    this.nav.innerHTML = ''
    var openFiles = donkey.files.getOpen()
    for (var file in openFiles) {
      openFiles[file].updateCategory()
      this.addFile(openFiles[file])
    }
    for (i = 0; i < expandedPaths.length; i++) {
      var navItem = this.getNavItemByPath(expandedPaths[i])
      if (navItem) {
        navItem.expand()
      }
    }
    for (var tabPath in this.openTabs) {
      var tab = this.openTabs[tabPath]
      if (!tab.modified) {
        tab.editor.build()
      }
    }
  }

  search (searchString) {
    if (searchString.length === 1 && !this.expandedPathsBeforeSearch) {
      var expandedNodes = document.querySelectorAll('.nav-item-expanded')
      var expandedPaths = []
      for (var i = 0; i < expandedNodes.length; i++) {
        expandedPaths.push(expandedNodes[i].dataset.path)
      }
      this.expandedPathsBeforeSearch = expandedPaths
    }

    for (var j = 0; j < this.nav.children.length; j++) {
      var item = this.nav.children[j]
      item.search(searchString)
    }

    if (searchString === '') {
      var navItems = document.querySelectorAll('.nav-item')
      for (j = 0; j < navItems.length; j++) {
        navItems[j].collapse()
      }
      for (j = 0; j < this.expandedPathsBeforeSearch.length; j++) {
        var navItem = this.getNavItemByPath(this.expandedPathsBeforeSearch[j])
        if (navItem) {
          navItem.expand()
        }
      }
      this.expandedPathsBeforeSearch = null
    }
  }

  newDataDialog (kvPath, data, title, detail, placeholder) {
    var filepath = kvpath.filepath(kvPath)
    var kvOnly = kvpath.stripfile(kvPath)
    if (!data) {
      data = new Map()
    }
    if (typeof data === 'string') {
      data = donkey.lang.getTemplateData(data)
    }
    if (!title) {
      title = 'Enter path for the new data, use "//" as seperator.'
    }
    if (!detail) {
      detail = filepath
    }
    if (!placeholder) {
      if (kvOnly) {
        kvOnly = kvpath.sep + kvOnly
      }
      placeholder = kvOnly + kvpath.sep
    }
    donkey.dialog.showInputDialog(title, detail, placeholder, (value) => {
      if (value) {
        var result = kvpath.join(filepath, value)
        if (donkey.files.pathExists(result)) {
          if (!donkey.dialog.showSimpleWarning('Path already exists. Do you want to overwrite the existing data?', 'You are overwriting:\n ' + result)) {
            return
          }
        }
        donkey.files.writeData(result, data)
        var navItem = this.getNavItemByPath(result)
        if (navItem) {
          navItem.open()
        }
      }
    })
  }

  removeDataDialog (kvPath) {
    if (donkey.dialog.showSimpleWarning('Are you sure you want to delete the selected item?', 'You are deleting:\n ' + kvPath)) {
      donkey.files.unlinkData(kvPath)
    }
  }

  renameDataDialog (kvPath) {
    var filepath = kvpath.filepath(kvPath)
    var kvOnly = kvpath.stripfile(kvPath)
    var title, detail
    if (kvOnly) {
      kvOnly = kvpath.sep + kvOnly
      title = 'Enter new path for data, use "//" as seperator.'
      detail = filepath
      donkey.dialog.showInputDialog(title, detail, kvOnly, (value) => {
        if (value) {
          var result = kvpath.join(filepath, value)
          if (donkey.files.pathExists(result)) {
            if (!donkey.dialog.showSimpleWarning('Path already exists. Do you want to overwrite the existing data?', 'You are overwriting:\n ' + result)) {
              return
            }
          }
          donkey.files.renameData(kvPath, result)
          var navItem = this.getNavItemByPath(result)
          if (navItem) {
            navItem.open()
          }
        }
      })
    } else {
      title = 'Enter new name for file'
      detail = path.join(filepath, '..') + path.sep
      kvOnly = path.basename(filepath)
      donkey.dialog.showInputDialog(title, detail, kvOnly, (value) => {
        if (value) {
          var result = path.join(detail, value)
          if (donkey.files.fileExists(result)) {
            if (!donkey.dialog.showSimpleWarning('Path already exists. Do you want to overwrite the existing data?', 'You are overwriting:\n ' + result)) {
              return
            }
          }
          donkey.files.rename(filepath, result)
        }
      })
    }
  }

  closeDialog (kvPath) {
    if (kvpath.isFile(kvPath)) {
      if (donkey.dialog.showSimpleWarning('Are you sure you want to Close the selected file?', 'You are closing:\n ' + kvPath)) {
        donkey.files.close(kvPath)
      }
    } else {
      this.closeTab(kvPath)
    }
  }

  getNavItemByPath (kvPath) {
    return document.querySelector('nav-item[data-path="' + kvPath + '"]')
  }

  addTab (kvPath) {
    var that = this
    setTimeout(function () {
      if (!that.openTabs[kvPath]) {
        donkey.files.setActive(kvPath)
        var tabItem = document.createElement('tab-item')

        tabItem.path = kvPath
        that.tabBar.appendChild(tabItem)

        for (var tabPath in that.openTabs) {
          that.openTabs[tabPath].hide()
        }
        that.openTabs[kvPath] = tabItem
        that.openTabs[kvPath].show()
        that.activeTab = that.openTabs[kvPath]
        that.setFooterPathText(kvPath)
      } else {
        that.selectTab(kvPath)
      }
    }, 0)
  }

  selectTab (path) {
    for (var tabPath in this.openTabs) {
      if (path === tabPath) {
        donkey.files.setActive(tabPath)
        this.openTabs[tabPath].show()
        this.activeTab = this.openTabs[tabPath]
        donkey.editor = this.activeTab.editor
      } else {
        this.openTabs[tabPath].hide()
      }
    }
    this.setFooterPathText(path)
  }

  getActiveTab () {
    return this.activeTab
  }

  closeTab (path) {
    var tab = path ? this.openTabs[path] : this.activeTab
    var nextSelection
    if (tab === this.activeTab) {
      nextSelection = tab.previousSibling
    }
    if (tab) {
      tab.close()
      this.removeTab(tab.path)
    }
    if (nextSelection) {
      this.selectTab(nextSelection.path)
    } else if (!this.activeTab) {
      this.setFooterPathText('')
    }
  }

  removeTab (path) {
    if (this.openTabs[path] === this.activeTab) {
      this.activeTab = null
    }
    delete this.openTabs[path]
  }

  setFooterSelectOption (value) {
    this.footerSelect.value = value
  }

  addFooterSelectOption (categoryName) {
    var opt = new Option(categoryName, categoryName)
    if (categoryName === donkey.lang.getActiveCategory()) {
      opt.selected = true
    }
    this.footerSelect.options.add(opt)
  }

  setFooterPathText (text) {
    this.footerPath.innerHTML = text
  }
}

module.exports = NavigationManager
