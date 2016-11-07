const FileManager = require('./FileManager')
const LanguageManager = require('./LanguageManager')
const NavigationManager = require('./NavigationManager')
const ConfigManager = require('./ConfigManager')
const KeymapManager = require('./KeymapManager')
const CommandRegistry = require('./CommandRegistry')
const ThemeManager = require('./ThemeManager')
const PackageManager = require('./PackageManager')
const Dialog = require('./Dialog')

class DonkeyEnviroment {
  constructor () {
    // make instance available during setup
    // REMINDER: if the donkey global is used in setup
    // not all modules are loaded.
    window.donkey = this
    window.VDFMap = require('./VDFMap')
    window.Parser = require('./Parser')
    window.Command = require('./commands/Command')
    window.UndoableCommand = require('./commands/UndoableCommand')
    window.BaseValue = require('./custom-elements/BaseValue')

    this.valueElements = {}
    this.valueElements.autocomplete = require('./value-elements/AutocompleteValue')
    this.valueElements.checkbox = require('./value-elements/CheckBoxValue')
    this.valueElements.file = require('./value-elements/FileValue')
    this.valueElements.openfile = require('./value-elements/OpenFileValue')
    this.valueElements.flagselector = require('./value-elements/FlagSelectorValue')
    this.valueElements.select = require('./value-elements/SelectValue')

    this.config = new ConfigManager()
    this.files = new FileManager()
    this.lang = new LanguageManager()
    this.dialog = new Dialog()
    this.nav = new NavigationManager()
    this.keys = new KeymapManager()
    this.commands = new CommandRegistry()
    this.themes = new ThemeManager()

    // load packages
    this.packages = new PackageManager()
  }
}

module.exports = DonkeyEnviroment
