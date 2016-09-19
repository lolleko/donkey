const heroFileMenu = [{
  label: 'Add Hero',
  click (menuItem, currentWindow) {
    donkey.nav.newDataDialog(menuItem.target.dataset.path, 'Dota2Hero', 'Enter the name of the new hero.', null, '//DOTAHeroes//npc_dota_hero_')
  }
}]

module.exports = donkey.lang.registerMenu('Dota2HeroFileMenu', heroFileMenu)
