const defaultEditorMenu = [
  {
    label: 'Add KeyValue',
    click: (menuItem, currentWindow) => {
      donkey.commands.exec('addkeyvalue', menuItem.target)
    }
  },
  {
    label: 'Add ParentKey',
    click: (menuItem, currentWindow) => {
      donkey.commands.exec('addparentkey', menuItem.target)
    }
  },
  {
    label: 'Add Comment',
    click: (menuItem, currentWindow) => {
      donkey.commands.exec('addcomment', menuItem.target)
    }
  },
  {
    type: 'separator'
  },
  {
    label: 'Cut KV Element',
    click: (menuItem, currentWindow) => {
      donkey.commands.exec('specialcut', menuItem.target)
    }
  },
  {
    label: 'Copy KV Element',
    click: (menuItem, currentWindow) => {
      donkey.commands.exec('specialcopy', menuItem.target)
    }
  },
  {
    label: 'Paste KV Element',
    click: (menuItem, currentWindow) => {
      donkey.commands.exec('specialpaste', menuItem.target)
    }
  },
  {
    label: 'Delete KV Element',
    click: (menuItem, currentWindow) => {
      donkey.commands.exec('specialdelete', menuItem.target)
    }
  }
]

module.exports = donkey.lang.registerMenu('KeyValueEditorMenu', defaultEditorMenu)
