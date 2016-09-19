const itemFileMenu = [{
  label: 'Add Item',
  click (menuItem, currentWindow) {
    donkey.nav.newDataDialog(menuItem.target.dataset.path, 'Dota2Item', 'Enter the name of the new item.', null, '//DOTAAbilities//item_')
  }
}, {
  label: 'Add Item Recipe',
  click (menuItem, currentWindow) {
    donkey.nav.newDataDialog(menuItem.target.dataset.path, 'Dota2ItemRecipe', 'Enter the name of the new item recipe.', null, '//DOTAAbilities//item_recipe_')
  }
}]

module.exports = donkey.lang.registerMenu('Dota2ItemFileMenu', itemFileMenu)
