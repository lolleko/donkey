class KeymapManager {
  constructor () {
    document.addEventListener('keydown', this, false)
    document.addEventListener('keyup', this, false)
    window.addEventListener('blur', this, false)

    this.commands = {}
    this.pressed = []
    this.translate = {}
    this.translate['plus'] = '+'
    this.translate['up'] = 'arrowup'
    this.translate['down'] = 'arrowdown'
    this.translate['return'] = 'enter'
  }

  get metaPressed () {
    return this.pressed.includes('meta')
  }

  get ctrlPressed () {
    return this.pressed.includes('control')
  }

  get shiftPressed () {
    return this.pressed.includes('shift')
  }

  get altPressed () {
    return this.pressed.includes('alt')
  }

  get cmdOrCtrlPressed () {
    return process.platform === 'darwin' ? this.metaPressed : this.ctrlPressed
  }

  get pressedTotal () {
    return this.pressed.length
  }

  register (accelerator, command) {
    this.commands[accelerator] = command
  }

  clear () {
    this.pressed = []
  }

  removePressedKey (key) {
    var i = this.pressed.indexOf(key.toLowerCase())
    this.pressed.splice(i, 1)
  }

  isModifier (key) {
    return key === 'meta' || key === 'alt' || key === 'shift' || key === 'control'
  }

  checkCommands () {
    // remove all shortcuts that do not meet the mdoifer requirements
    // this will prevent Ctrl + C from firing if Ctrl + Shift + C is pressed
    var shortcuts = Object.keys(this.commands)
    for (var j = 0; j < shortcuts.length; j++) {
      var shortcut = shortcuts[j].toLowerCase()
      if (this.altPressed && !shortcut.includes('alt') || this.shiftPressed && !shortcut.includes('shift')) {
        shortcuts.splice(j, 1)
        j--
      }
    }

    var commandExecuted = false
    for (j = 0; j < shortcuts.length; j++) {
      var accelerator = shortcuts[j]
      var cmdOrCtrlRequired = false
      var keyString = accelerator
      if (accelerator.includes('CommandOrControl')) {
        cmdOrCtrlRequired = true
        keyString = accelerator.replace('CommandOrControl+', '')
      }
      if (accelerator.includes('CmdOrCtrl')) {
        cmdOrCtrlRequired = true
        keyString = accelerator.replace('CmdOrCtrl+', '')
      }

      if (cmdOrCtrlRequired && !this.cmdOrCtrlPressed) {
        break
      }

      var requiredKeys = keyString.toLowerCase().split('+')
      for (var identifer in this.translate) {
        var index = requiredKeys.indexOf(identifer)
        if (index >= 0) {
          requiredKeys[index] = this.translate[identifer]
        }
      }
      var requiredKeysPressed = true

      for (var i = 0; i < requiredKeys.length; i++) {
        if (!this.pressed.includes(requiredKeys[i])) {
          requiredKeysPressed = false
        }
      }

      if (requiredKeysPressed) {
        donkey.commands.exec(this.commands[accelerator])
        commandExecuted = true

        for (i = 0; i < requiredKeys.length; i++) {
          if (!this.isModifier(requiredKeys[i])) {
            this.removePressedKey(requiredKeys[i])
          }
        }
      }
    }

    return commandExecuted
  }

  handleEvent (e) {
    switch (e.type) {
      case 'keydown':
        this.onKeyDown(e)
        break
      case 'keyup':
        this.onKeyUp(e)
        break
      case 'blur':
        this.onBlur(e)
        break
    }
  }

  onKeyDown (e) {
    var key = e.key.toLowerCase()
    if (this.pressed.indexOf(key) < 0) {
      this.pressed.push(key)
    }
    if (this.checkCommands()) {
      e.preventDefault()
    }
  }

  onKeyUp (e) {
    var key = e.key.toLowerCase()
    var i = this.pressed.indexOf(key)
    while (i >= 0) {
      this.pressed.splice(i, 1)
      i = this.pressed.indexOf(key)
    }

    // OSX workaround
    // Sadly because holding CMD on osx does not trigger keyup events for other keys
    // all keys have to be cleared
    if (process.platform === 'darwin' && e.key.toLowerCase() === 'meta') {
      this.clear()
    }
  }

  onBlur (e) {
    this.clear()
  }
}

module.exports = KeymapManager
