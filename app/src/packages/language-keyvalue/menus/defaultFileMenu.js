const defaultFileMenu = [
  {
    label: 'New SubKey',
    click (menuItem, currentWindow) {
      donkey.nav.newDataDialog(menuItem.target.dataset.path)
    }
  },
  {
    type: 'separator'
  },
  {
    label: 'Delete',
    click (menuItem, currentWindow) {
      donkey.nav.removeDataDialog(menuItem.target.dataset.path)
    }
  },
  {
    label: 'Duplicate',
    click (menuItem, currentWindow) {
      donkey.files.duplicateData(menuItem.target.dataset.path)
    }
  },
  {
    label: 'Rename',
    click (menuItem, currentWindow) {
      donkey.nav.renameDataDialog(menuItem.target.dataset.path)
    }
  }
]

module.exports = donkey.lang.registerMenu('KeyValueFileMenu', defaultFileMenu)
