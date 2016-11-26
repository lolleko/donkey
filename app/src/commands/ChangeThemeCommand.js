class ChangeThemeCommand extends Command {
  constructor (theme) {
    super()

    this.theme = theme
  }

  execute () {
    donkey.themes.load(this.theme)
  }

}

module.exports = donkey.commands.add('change-theme', ChangeThemeCommand, {executeGlobal: true})
