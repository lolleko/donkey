const unitFileMenu = [{
  label: 'Add Unit',
  click (menuItem, currentWindow) {
    donkey.nav.newDataDialog(menuItem.target.dataset.path, 'Dota2Unit', 'Enter the name of the new unit.', null, '//DOTAUnits//')
  }
}]

module.exports = donkey.lang.registerMenu('Dota2UnitFileMenu', unitFileMenu)
