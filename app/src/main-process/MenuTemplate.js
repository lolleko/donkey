const electron = require('electron')

const dialog = electron.dialog
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const template = [{
  label: 'File',
  submenu: [{
    label: 'New Window',
    accelerator: 'CmdOrCtrl+Shift+N',
    click: (menuItem, currentWindow) => {
      var win = new BrowserWindow({
        width: 1260,
        height: 800,
        backgroundColor: '#dcdce0'
      })

      win.loadURL(`file://${__dirname}/../../static/index.html`)
    }
  }, {
    label: 'New File...',
    accelerator: 'CmdOrCtrl+N',
    click: (menuItem, currentWindow) => {
      dialog.showSaveDialog(currentWindow, {
        title: 'New File',
        buttonLabel: 'Create'
      }, function (fileName) {
        if (fileName) currentWindow.webContents.send('command:new-file', fileName)
      })
    }
  }, {
    label: 'Open File...',
    accelerator: 'CmdOrCtrl+O',
    click: (menuItem, currentWindow) => {
      dialog.showOpenDialog(currentWindow, {
        properties: ['openFile']
      }, function (files) {
        if (files) currentWindow.webContents.send('command:open-file', files)
      })
    }
  }, {
    label: 'Open Directory...',
    accelerator: 'CmdOrCtrl+Shift+O',
    click: (menuItem, currentWindow) => {
      dialog.showOpenDialog(currentWindow, {
        properties: ['openDirectory']
      }, function (files) {
        if (files) currentWindow.webContents.send('command:open-directory', files)
      })
    }
  }, {
    type: 'separator'
  }, {
    label: 'Save',
    accelerator: 'CmdOrCtrl+S',
    click: (menuItem, currentWindow) => {
      currentWindow.webContents.send('command:save-file')
    }
  }, {
    type: 'separator'
  }, {
    label: 'Close Tab',
    accelerator: 'CmdOrCtrl+W',
    click: (menuItem, currentWindow) => {
      currentWindow.webContents.send('command:close-tab')
    }
  }, {
    label: 'Close Window',
    accelerator: 'CmdOrCtrl+Shift+W',
    role: 'close'
  }]
}, {
  label: 'Edit',
  submenu: [{
    label: 'Undo',
    accelerator: 'CmdOrCtrl+Z',
    click: (menuItem, currentWindow) => {
      currentWindow.webContents.send('command:undo')
    }
  }, {
    label: 'Redo',
    accelerator: 'CmdOrCtrl+Y',
    click: (menuItem, currentWindow) => {
      currentWindow.webContents.send('command:redo')
    }
  }, {
    type: 'separator'
  }, {
    label: 'Cut',
    accelerator: 'CmdOrCtrl+X',
    click: (menuItem, currentWindow) => {
      currentWindow.webContents.send('command:cut')
    }
  }, {
    label: 'Copy',
    accelerator: 'CmdOrCtrl+C',
    click: (menuItem, currentWindow) => {
      currentWindow.webContents.send('command:copy')
    }
  }, {
    label: 'Paste',
    accelerator: 'CmdOrCtrl+V',
    click: (menuItem, currentWindow) => {
      currentWindow.webContents.send('command:paste')
    }
  }, {
    role: 'delete'
  }, {
    role: 'selectall'
  }, {
    type: 'separator'
  }, {
    label: 'Add KeyValue',
    accelerator: 'CmdOrCtrl+L',
    click: (menuItem, currentWindow) => {
      currentWindow.webContents.send('command:addkeyvalue')
    }
  }, {
    label: 'Add ParentKey',
    accelerator: 'CmdOrCtrl+P',
    click: (menuItem, currentWindow) => {
      currentWindow.webContents.send('command:addparentkey')
    }
  }, {
    label: 'Cut KV Element',
    accelerator: 'CmdOrCtrl+Alt+X',
    click: (menuItem, currentWindow) => {
      currentWindow.webContents.send('command:specialcut')
    }
  }, {
    label: 'Copy KV Element',
    accelerator: 'CmdOrCtrl+Alt+C',
    click: (menuItem, currentWindow) => {
      currentWindow.webContents.send('command:specialcopy')
    }
  }, {
    label: 'Paste KV Element',
    accelerator: 'CmdOrCtrl+Alt+V',
    click: (menuItem, currentWindow) => {
      currentWindow.webContents.send('command:specialpaste')
    }
  }, {
    label: 'Delete KV Element',
    accelerator: 'CmdOrCtrl+Alt+D',
    click: (menuItem, currentWindow) => {
      currentWindow.webContents.send('command:specialdelete')
    }
  }, {
    label: 'Move Up KV Element',
    accelerator: 'CmdOrCtrl+Up',
    click: (menuItem, currentWindow) => {
      currentWindow.webContents.send('command:moveup')
    }
  }, {
    label: 'Move Down KV Element',
    accelerator: 'CmdOrCtrl+Down',
    click: (menuItem, currentWindow) => {
      currentWindow.webContents.send('command:movedown')
    }
  }]
}, {
  label: 'View',
  submenu: [{
    label: 'Reload',
    accelerator: 'CmdOrCtrl+R',
    click: (menuItem, currentWindow) => {
      if (currentWindow) currentWindow.reload()
    }
  }, {
    role: 'togglefullscreen'
  }, {
    label: 'Toggle Developer Tools',
    accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
    click: (menuItem, currentWindow) => {
      if (currentWindow) {
        currentWindow.webContents.toggleDevTools()
      }
    }
  }, {
    type: 'separator'
  }, {
    label: 'Increase Font Size',
    accelerator: 'CmdOrCtrl+=',
    click: (menuItem, currentWindow) => {
      currentWindow.webContents.send('command:zoomin')
    }
  }, {
    label: 'Decrease Font Size',
    accelerator: 'CmdOrCtrl+-',
    click: (menuItem, currentWindow) => {
      currentWindow.webContents.send('command:zoomout')
    }
  }]
}, {
  label: 'Find',
  submenu: [{
    label: 'Find in File',
    accelerator: 'CmdOrCtrl+F',
    click: (menuItem, currentWindow) => {
    }
  }]
}, {
  role: 'window',
  submenu: [{
    label: 'Minimize',
    accelerator: 'CmdOrCtrl+M',
    role: 'minimize'
  }, {
    label: 'Zoom',
    role: 'zoom'
  }, {
    type: 'separator'
  }, {
    label: 'Bring All to Front',
    role: 'front'
  }]
}, {
  role: 'help',
  submenu: [{
    label: 'Learn More',
    click: (menuItem, currentWindow) => {
      electron.shell.openExternal('http://github.com/lolleko/donkey')
    }
  }]
}]

if (process.platform === 'darwin') {
  const name = app.getName()
  template.unshift({
    label: name,
    submenu: [{
      role: 'about'
    }, {
      type: 'separator'
    }, {
      role: 'services',
      submenu: []
    }, {
      type: 'separator'
    }, {
      role: 'hide'
    }, {
      role: 'hideothers'
    }, {
      role: 'unhide'
    }, {
      type: 'separator'
    }, {
      role: 'quit'
    }]
  })
}

function getTemplate () {
  return template
}

module.exports = {
  getTemplate: getTemplate
}
