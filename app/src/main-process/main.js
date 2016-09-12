const electron = require('electron')

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const MenuTemplate = require('./MenuTemplate')

function createWindow () {
  var win = new BrowserWindow({
    width: 1260,
    height: 800,
    backgroundColor: '#dcdce0'
  })

  win.loadURL(`file://${__dirname}/../../static/index.html`)
}

function onReady () {
  const menu = Menu.buildFromTemplate(MenuTemplate.getTemplate())
  Menu.setApplicationMenu(menu)
  createWindow()
}

app.on('ready', onReady)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', (e, hasVisibleWindows) => {
  if (!hasVisibleWindows) {
    createWindow()
  }
})
