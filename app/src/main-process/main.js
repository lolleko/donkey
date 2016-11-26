const electron = require('electron')

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const MenuManager = require('./MenuManager')

if (require('electron-squirrel-startup')) app.quit()

// Auto Updater
if (!require('electron-is-dev')) {
  const AutoUpdater = require('./AutoUpdater')
  AutoUpdater.checkForUpdates()
}

function createWindow () {
  var win = new BrowserWindow({
    width: 1260,
    height: 800,
    backgroundColor: '#dcdce0'
  })

  win.loadURL(`file://${__dirname}/../../static/index.html`)
}

function onReady () {
  MenuManager.initApplicationMenu()
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
