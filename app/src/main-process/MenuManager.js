const electron = require('electron')

const Menu = electron.Menu
const MenuTemplate = require('./MenuTemplate')
const ipc = electron.ipcMain

exports.rebuildMenu = () => {
  Menu.setApplicationMenu(Menu.buildFromTemplate(MenuTemplate.getTemplate()))
}

exports.addPackageMenu = (packageName, menuTemplate) => {
  MenuTemplate.addPackageMenu(packageName, menuTemplate)
  exports.rebuildMenu()
}

exports.initApplicationMenu = () => {
  exports.rebuildMenu()
}

ipc.on('donkey-add-package-menu', (event, packageName, menuTemplate) => {
  exports.addPackageMenu(packageName, menuTemplate)
})
