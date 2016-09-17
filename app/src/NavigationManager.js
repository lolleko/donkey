const kvpath = require('./kvpath')

class NavigationManager {
  constructor () {
    this.nav = document.querySelector('.nav')
    this.tabBar = document.querySelector('.tab-bar')
    this.openTabs = {}
    this.activeTab
  }

  addFile (file) {
    var navItem = document.createElement('nav-item')
    navItem.dataset.path = file.path
    navItem.data = file.data
    this.nav.appendChild(navItem)
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
    var data = new Map()
    var title = 'Enter new path for data, use "//" as seperator.'
    var detail = filepath
    if (kvOnly) {
      kvOnly = kvpath.sep + kvOnly
    }
    donkey.dialog.showInputDialog(title, detail, kvOnly, (value) => {
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
        donkey.files.unlinkData(kvPath)
      }
    })
  }

  getNavItemByPath (kvPath) {
    return document.querySelector('nav-item[data-path="' + kvPath + '"]')
  }

  addTab (navItem) {
    var that = this
    setTimeout(function () {
      if (!that.openTabs[navItem.dataset.path]) {
        donkey.files.setActive(navItem.dataset.path)
        var tabItem = document.createElement('tab-item')

        tabItem.path = navItem.dataset.path
        that.tabBar.appendChild(tabItem)

        for (var tabPath in that.openTabs) {
          that.openTabs[tabPath].hide()
        }

        that.openTabs[navItem.dataset.path] = tabItem
        that.openTabs[navItem.dataset.path].show()
        that.activeTab = that.openTabs[navItem.dataset.path]
      } else {
        that.selectTab(navItem.dataset.path)
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
  }

  getActiveTab () {
    return this.activeTab
  }

  closeTab (path) {
    var tab = this.openTabs[path] || this.activeTab
    tab.close()
    this.removeTab(path)
  }

  removeTab (path) {
    if (this.openTabs[path] === this.activeTab) {
      this.activeTab = null
    }
    delete this.openTabs[path]
  }
}

module.exports = NavigationManager
