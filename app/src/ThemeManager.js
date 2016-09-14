class ThemeManager {
  constructor () {
    this.themes = {}

    donkey.config.onChange('donkey.theme', (oldVal, newVal) => {
      this.load(newVal)
    })
  }

  get current () {
    return donkey.config.get('donkey.theme')
  }

  set current (theme) {
    donkey.config.set('donkey.theme', theme)
  }

  load (name) {
    if (this.exists(name)) {
      var link = document.getElementById('theme-stylesheet')
      link.setAttribute('href', this.themes[name])
    }
  }

  exists (name) {
    if (this.themes[name]) {
      return true
    }

    return false
  }

  add (name, mainPath) {
    this.themes[name] = mainPath
    if (this.current === name) {
      this.load(name)
    }
  }
}

module.exports = ThemeManager
