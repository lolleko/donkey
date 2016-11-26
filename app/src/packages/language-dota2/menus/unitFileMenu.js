const d2utils = require('./../d2utils')

const unitFileMenu = [{
  label: 'Add Unit',
  click (menuItem, currentWindow) {
    donkey.nav.newDataDialog(menuItem.target.dataset.path, 'Dota2Unit', 'Enter the name of the new unit.', null, '//DOTAUnits//')
  }
}, {
  label: 'Edit Unit Metadata',
  click (menuItem, currentWindow) {
    d2utils.editMetaData(menuItem.target.name, menuItem.target.dataset.path, [['Name', '']])
  }
}]

module.exports = donkey.lang.registerMenu('Dota2UnitFileMenu', unitFileMenu)
