const electron = require('electron')

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const MenuTemplate = require('./MenuTemplate')

if (require('electron-squirrel-startup')) app.quit()

// Auto Updater
if (!require('electron-is-dev')) {
  const autoUpdater = electron.autoUpdater
  const feedURL = 'http://donkey-download.herokuapp.com/update/' + process.platform + '/' + app.getVersion()
  const dialog = electron.dialog

  autoUpdater.on('update-available', function () {
    // console.log('update-available')
  })

  autoUpdater.on('error', function (err) {
    dialog.showErrorBox('Auto Updater Error', err)
  })

  autoUpdater.on('update-downloaded', function (e, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
    var index = dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Donkey',
      message: 'A new version has been downloaded. Please restart the application to apply the updates.',
      detail: releaseName
    })

    if (index === 1) {
      return
    }

    autoUpdater.quitAndInstall()
  })

  autoUpdater.setFeedURL(feedURL)
  autoUpdater.checkForUpdates()
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
