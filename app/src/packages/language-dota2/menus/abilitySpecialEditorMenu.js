const abilitySpecialMenu = [{
  label: 'Add Variable',
  click (menuItem, currentWindow) {
    donkey.commands.exec('dota:addabilityspecialvar', menuItem.target, '0' + (menuItem.target.size + 1))
  }
}]
module.exports = donkey.lang.registerMenu('Dota2AbilitySpecialEditorMenu', abilitySpecialMenu)
