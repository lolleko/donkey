const d2utils = require('./../d2utils')

const abilityMenu = [{
  label: 'Add Ability',
  click (menuItem, currentWindow) {
    donkey.nav.newDataDialog(menuItem.target.dataset.path, 'Dota2ActiveAbility', 'Enter the name of the new ability.', null, '//DOTAAbilities//')
  }
}, {
  label: 'Add Passive',
  click (menuItem, currentWindow) {
    donkey.nav.newDataDialog(menuItem.target.dataset.path, 'Dota2PassiveAbility', 'Enter the name of the new ability.', null, '//DOTAAbilities//')
  }
}, {
  label: 'Edit Tooltip Data',
  click (menuItem, currentWindow) {
    d2utils.editMetaData(menuItem.target.name, menuItem.target.dataset.path, [['Name', ''], ['Description', ''], ['Lore', ''], ['Note0', ''], ['Note1', '']])
  }
}]

module.exports = donkey.lang.registerMenu('Dota2AbilityFileMenu', abilityMenu)
