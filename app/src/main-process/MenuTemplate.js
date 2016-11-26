const electron = require('electron')

const app = electron.app
const BrowserWindow = electron.BrowserWindow

var template = [{
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
      currentWindow.webContents.send('command:new-file')
    }
  }, {
    label: 'Open File...',
    accelerator: 'CmdOrCtrl+O',
    click: (menuItem, currentWindow) => {
      currentWindow.webContents.send('command:open-file')
    }
  }, {
    label: 'Open Directory...',
    accelerator: 'CmdOrCtrl+Shift+O',
    click: (menuItem, currentWindow) => {
      currentWindow.webContents.send('command:open-directory')
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
    label: 'Add Comment',
    accelerator: 'CmdOrCtrl+,',
    click: (menuItem, currentWindow) => {
      currentWindow.webContents.send('command:addcomment')
    }
  }, {
    label: 'Cut KV Element',
    accelerator: 'CmdOrCtrl+Shift+X',
    click: (menuItem, currentWindow) => {
      currentWindow.webContents.send('command:specialcut')
    }
  }, {
    label: 'Copy KV Element',
    accelerator: 'CmdOrCtrl+Shift+C',
    click: (menuItem, currentWindow) => {
      currentWindow.webContents.send('command:specialcopy')
    }
  }, {
    label: 'Paste KV Element',
    accelerator: 'CmdOrCtrl+Shift+V',
    click: (menuItem, currentWindow) => {
      currentWindow.webContents.send('command:specialpaste')
    }
  }, {
    label: 'Delete KV Element',
    accelerator: 'CmdOrCtrl+Shift+D',
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
  label: 'Packages',
  submenu: []
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

exports.getTemplate = () => {
  return template
}

exports.addPackageMenu = (packageName, menuTemplate) => {
  for (var i = 0; i < template.length; i++) {
    if (template[i].label === 'Packages') {
      var submenu = template[i].submenu
      var exists = false
      for (var j = 0; j < submenu.length; j++) {
        if (submenu[j].label === packageName) {
          exists = true
          submenu[j] = {label: packageName, submenu: convertTemplate(menuTemplate)}
        }
      }
      if (!exists) {
        template[i].submenu.push({label: packageName, submenu: convertTemplate(menuTemplate)})
      }
    }
  }
}

function convertTemplate (menuTemplate) {
  var submenu = []
  for (var i = 0; i < menuTemplate.length; i++) {
    var current = Object.assign({}, menuTemplate[i])
    var commandArgs = current.commandArgs ? current.commandArgs.slice() : []
    var item = {
      label: current.label + '',
      command: current.command,
      commandArgs: commandArgs,
      click: function (menuItem, currentWindow) {
        currentWindow.webContents.send('command:' + menuItem.command, ...menuItem.commandArgs)
      }
    }
    submenu.push(item)
  }
  return submenu
}
