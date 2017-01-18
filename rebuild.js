let { installNodeHeaders, rebuildNativeModules, shouldRebuildNativeModules } = require('electron-rebuild')

let childProcess = require('child_process')
let pathToElectron = require('electron')

console.log('Rebuilding native modules.')

shouldRebuildNativeModules(pathToElectron)
  .then((shouldBuild) => {
    if (!shouldBuild) return true

    let electronVersion = childProcess.execSync(`${pathToElectron} --version`, {
      encoding: 'utf8'
    })
    electronVersion = electronVersion.match(/v(\d+\.\d+\.\d+)/)[1]

    return installNodeHeaders(electronVersion)
      .then(() => rebuildNativeModules(electronVersion, './app/node_modules'))
  })
  .catch((e) => {
    console.error("Building modules didn't work!")
    console.error(e)
  })
