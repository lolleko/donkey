const Menu = require('electron').remote.Menu
const vdf = require('./vdf')

class LanguageManager {
  constructor () {
    this.activeCategory = 'KeyValue'
    this.menus = {}
    this.categories = {}
    this.templates = {}
  }

  setActiveCategory (category) {
    this.activeCategory = category
  }

  detectCategory (map) {
    var results = {}
    for (var categoryName in this.categories) {
      var category = this.categories[categoryName]
      results[categoryName] = this._detectCategory(map, category, 0)
    }

    var maxKey = Object.keys(results).reduce((a, b) => {
      if (results[a] === results[b]) {
        var aCat = this.categories[a]
        var bCat = this.categories[b]
        if (aCat.parentKeySuggestions && aCat.keySuggestions && bCat.parentKeySuggestions && bCat.keySuggestions) {
          var aSize = aCat.parentKeySuggestions.length + aCat.keySuggestions.length
          var bSize = bCat.parentKeySuggestions.length + bCat.keySuggestions.length
          return bSize < aSize ? b : a
        }
      }
      if (results[a] > results[b]) {
        return a
      } else {
        return b
      }
    })

    if (results[maxKey] === 0) {
      return 'KeyValue'
    }

    return maxKey
  }

  _detectCategory (map, category, matchCounter) {
    for (var [k, v] of map) {
      if (v.size) {
        if (category.parentKeySuggestions.includes(k)) {
          matchCounter++
        }
        matchCounter = matchCounter + this._detectCategory(v, category, 0)
      } else {
        if (category.keySuggestions.includes(k)) {
          matchCounter++
        }
      }
    }

    return matchCounter
  }

  add (name, lang) {
    for (var categoryName in lang.categories) {
      var category = lang.categories[categoryName]

      if (!category.parentKeySuggestions) {
        category.parentKeySuggestions = []
      }
      if (!category.keySuggestions) {
        category.keySuggestions = []
      }
      if (!category.specialKeys) {
        category.specialKeys = {}
      }

      this.categories[categoryName] = category

      if (category.category) {
        this.categories[categoryName] = this.merge(category, lang.categories[category.category])
      }
    }
  }

  merge (a, b) {
    if (b.category) {
      b = this.merge(b, this.categories[b.category])
    }

    var result = {}

    for (var key in b) {
      result[key] = b[key]
    }

    for (key in a) {
      if (!result[key]) {
        result[key] = a[key]
      } else {
        if (Array.isArray(result[key])) {
          result[key] = result[key].concat(a[key])
        } else if (typeof result[key] === 'string') {
          result[key] = a[key]
        } else {
          result[key] = this.merge(result[key], a[key])
        }
      }
    }

    return result
  }

  isSpecialKey (key, category) {
    category = category || this.activeCategory

    if (this.categories.specialKeys[key]) {
      return true
    }

    return false
  }

  getSpecialKeyData (key, category) {
    category = category || this.activeCategory

    return this.categories[category].specialKeys[key]
  }

  hasCustomValue (key, category) {
    var keyData = this.getSpecialKeyData(key, category)
    if (keyData && keyData.valueElement) {
      return true
    }

    return false
  }

  getCustomValueElement (key, category) {
    var keyData = this.getSpecialKeyData(key, category)

    if (keyData) {
      var result = []
      result[0] = keyData.valueElement
      result[1] = keyData.options || {}
      return result
    }

    return false
  }

  getParentKeySuggestions (file, category) {
    category = category || this.activeCategory

    return this.categories[category].parentKeySuggestions
  }

  hasParentKeySuggestions (file, category) {
    category = category || this.activeCategory

    return this.categories[category].parentKeySuggestions.length > 0
  }

  getKeySuggestions (file, category) {
    category = category || this.activeCategory

    return this.categories[category].keySuggestions
  }

  hasKeySuggestions (file, category) {
    category = category || this.activeCategory

    return this.categories[category].keySuggestions.length > 0
  }

  getIconForFile (filePath) {
    var fileCategory = this.categories[donkey.files.get(filePath).category]
    if (fileCategory.icon) {
      return fileCategory.icon
    }
    return 'octicon-file'
  }

  registerMenu (menuID, menuTemplate, mergeWithDefault) {
    // this is necessary because mergeWithDefault can be undefined
    if (mergeWithDefault !== false) {
      mergeWithDefault = true
    }
    this.menus[menuID] = {template: menuTemplate, merge: mergeWithDefault}
    return this.menus[menuID]
  }

  openEditorContextMenu (element) {
    var menuID
    var keyData = this.getSpecialKeyData(element.dataset.key)
    if (keyData && keyData.menu) {
      menuID = keyData.menu
    } else {
      menuID = 'KeyValueEditorMenu'
    }

    this.openContextMenu(element, menuID, 'KeyValueEditorMenu')
  }

  openFileContextMenu (element) {
    var menuID = this.categories[donkey.files.get(element.dataset.path).category].menu
    if (!menuID) {
      menuID = 'KeyValueFileMenu'
    }

    this.openContextMenu(element, menuID, 'KeyValueFileMenu')
  }

  openContextMenu (element, menuID, defaultMenu) {
    if (!menuID) {
      return
    }
    var menu = this.menus[menuID]
    var template
    if (menu.merge && menuID !== defaultMenu) {
      var defaultFileMenuTemplate = this.menus[defaultMenu].template
      defaultFileMenuTemplate.push({type: 'separator'})
      template = defaultFileMenuTemplate.concat(menu.template)
    } else {
      template = menu.template
    }
    var menuInstance = Menu.buildFromTemplate(template)
    this._setMenuContext(menuInstance, element)
    menuInstance.popup()
  }

  _setMenuContext (menu, element) {
    if (!menu) {
      return
    }
    for (var i = 0; i < menu.items.length; i++) {
      menu.items[i].target = element
      this._setMenuContext(menu.items[i].submenu)
    }
  }

  registerTemplate (templateID, templateString) {
    this.templates[templateID] = {
      data: vdf.parse(templateString),
      string: templateString
    }
  }

  getTemplate (templateID) {
    return this.templates[templateID]
  }

  getTemplateData (templateID) {
    return this.getTemplate(templateID).data
  }

  getTemplateString (templateID) {
    return this.getTemplate(templateID).string
  }
}

module.exports = LanguageManager
