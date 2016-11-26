const electron = require('electron')
const autoUpdater = electron.autoUpdater
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const dialog = electron.dialog

const feedURL = 'http://donkey-download.herokuapp.com/update/' + process.platform + '/' + app.getVersion()

autoUpdater.setFeedURL(feedURL)

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

exports.checkForUpdates = () => {
  autoUpdater.checkForUpdates()
}
