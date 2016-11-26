class ChangeThemeCommand extends Command {
  constructor (theme) {
    super()

    this.theme = theme
  }

  execute () {
    console.log(this.theme);
    donkey.themes.load(this.theme)
  }

}

module.exports = donkey.commands.add('change-theme', ChangeThemeCommand, {executeGlobal: true})
