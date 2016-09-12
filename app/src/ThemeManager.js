const path = require('path')
const fs = require('fs')
const electron = require('electron').remote

const Menu = electron.Menu
const MenuItem = electron.MenuItem

class ThemeManager {
  constructor () {
    this.themes = {}

    var themeDirs = fs.readdirSync(path.join(__dirname, '/../static/css/themes'))
    for (var i = 0; i < themeDirs.length; i++) {
      var themeDirName = themeDirs[i]
      this.themes[themeDirName] = themeDirName[0].toUpperCase() + themeDirName.substr(1)
    }

    this.loadTheme(donkey.config.get('donkey.theme'))

    donkey.config.onChange('donkey.theme', (oldVal, newVal) => {
      this.loadTheme(newVal)
    })

    var appMenu = Menu.getApplicationMenu()

    for (i = 0; i < appMenu.items.length; i++) {
      if (appMenu.items[i].label === 'Themes') {
        return
      }
    }

    var themeListSubmenu = new Menu()

    for (var theme in this.themes) {
      var themeName = this.themes[theme]
      var checked = theme === this.current
      var item = new MenuItem({
        label: themeName,
        type: 'radio',
        checked: checked,
        click: (menuItem, currentWindow) => {
          this.current = menuItem.theme
        }
      })
      item.theme = theme
      themeListSubmenu.append(item)
    }

    var themeMenuItem = new MenuItem({
      label: 'Themes',
      submenu: themeListSubmenu
    })

    appMenu.append(themeMenuItem)

    Menu.setApplicationMenu(appMenu)
  }

  get current () {
    return donkey.config.get('donkey.theme')
  }

  set current (theme) {
    donkey.config.set('donkey.theme', theme)
  }

  loadTheme (name) {
    name = name.toLowerCase()
    if (this.exists(name)) {
      var link = document.getElementById('theme-stylesheet')
      link.setAttribute('href', this.getThemeMain(name))
    }
  }

  exists (name) {
    name = name.toLowerCase()
    if (this.themes[name]) {
      return true
    }

    return false
  }

  getThemeMain (name) {
    return path.join('./css/themes', name, 'main.css')
  }
}

module.exports = ThemeManager
