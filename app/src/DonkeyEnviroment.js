const FileManager = require('./FileManager')
const LanguageManager = require('./LanguageManager')
const NavigationManager = require('./NavigationManager')
const ConfigManager = require('./ConfigManager')
const KeymapManager = require('./KeymapManager')
const CommandRegistry = require('./CommandRegistry')
const ThemeManager = require('./ThemeManager')

class DonkeyEnviroment {
  constructor () {
    // make class available during setup
    // Be aware that if you use the donkey global in setup,
    // not all modules are loaded.
    window.donkey = this

    this.config = new ConfigManager()
    this.files = new FileManager()
    this.lang = new LanguageManager()
    this.nav = new NavigationManager()
    this.keys = new KeymapManager()
    this.commands = new CommandRegistry()
    this.themes = new ThemeManager()
  }
}

module.exports = DonkeyEnviroment
