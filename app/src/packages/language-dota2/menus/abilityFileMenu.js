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
}]

module.exports = donkey.lang.registerMenu('Dota2AbilityFileMenu', abilityMenu)
