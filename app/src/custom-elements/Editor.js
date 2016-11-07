class Editor extends HTMLElement {

  createdCallback () {
    this.addEventListener('contextmenu', this, false)
    this.addEventListener('focusin', this, false)
    this.classList.add('editor')
    this.selection = []
    this.undoStack = []
    this.redoStack = []
  }

  get isEditor () {
    return true
  }

  get activeElement () {
    return this.findHighlightable(document.activeElement)
  }

  set modified (value) {
    this.tabItem.modified = value
  }

  get subKVElements () {
    return this.children
  }

  insert (element) {
    var inserted
    if (element.nodeName === '#document-fragment') {
      inserted = [].slice.call(element.children)
      this.insertBefore(element, this.firstChild)
    } else {
      inserted = this.insertBefore(element, this.firstChild)
    }
    return inserted
  }

  remove () {
    this.innerHTML = ''
  }

  build () {
    // if path no longer exists we have been deleted
    if (!donkey.files.pathExists(this.path) && !this.modified) {
      donkey.nav.closeTab(this.path)
    } else {
      var data = donkey.files.readData(this.path)
      this.kvData = data
      this.innerHTML = ''
      this.appendChild(donkey.files.dataToNode(data))
    }
  }

  findHighlightable (element) {
    var pointer = element
    while (pointer.tagName !== 'PARENT-KEY' && pointer.tagName !== 'KEY-VALUE') {
      if (pointer === document) {
        return null
      }
      pointer = pointer.parentNode
    }
    return pointer
  }

  select (element) {
    if (!element) {
      return
    }
    element.classList.add('donkey-selected')
    this.selection.push(element)
  }

  clear () {
    for (var i = 0; i < this.selection.length; i++) {
      this.selection[i].classList.remove('donkey-selected')
    }
    this.selection = []
  }

  execCommand (cmd) {
    if (cmd.isUndoable) {
      var lastCmd = this.undoStack[this.undoStack.length - 1]
      if (lastCmd && lastCmd.isMergable && cmd.isMergable && Object.getPrototypeOf(lastCmd) === Object.getPrototypeOf(cmd)) {
        var delaySmallEnough = cmd.timeStamp - lastCmd.timeStamp <= cmd.mergeDelay
        var maxMergesExceeded = (lastCmd.maxMerges === -1 || lastCmd.maxMerges < lastCmd.merges + 1)
        if (!delaySmallEnough || maxMergesExceeded || !lastCmd.merge(cmd)) {
          this.undoStack.push(cmd)
        } else {
          lastCmd.timeStamp = cmd.timeStamp
          lastCmd.merges++
        }
      } else {
        this.undoStack.push(cmd)
      }
    }
    cmd.execute()
    if (cmd.isManipulator) {
      this.modified = true
      this.redoStack = []
    }

    return cmd
  }

  undo () {
    console.log(this.undoStack)
    var lastCmd = this.undoStack.pop()
    console.log(this.undoStack)
    if (lastCmd) {
      lastCmd.undo()
      this.redoStack.push(lastCmd)
    }
  }

  redo () {
    var undoneCmd = this.redoStack.pop()
    if (undoneCmd) {
      undoneCmd.redo()
      this.undoStack.push(undoneCmd)
    }
  }

  toString () {
    return donkey.files.nodeToKVString(this)
  }

  save () {
    donkey.files.writeData(this.path, donkey.files.nodeToData(this))
    donkey.files.write()
    this.modified = false
  }

  close () {
    this.parentNode.removeChild(this)
  }

  handleEvent (e) {
    switch (e.type) {
      case 'contextmenu':
        this.onContextMenu(e)
        break
      case 'focusin':
        this.onFocusIn(e)
        break
    }
  }

  onContextMenu (e) {
    donkey.lang.openEditorContextMenu(this)
  }

  onFocusIn (e) {
    if (donkey.keys.cmdOrCtrlPressed && donkey.keys.pressedTotal <= 1) {
      this.select(this.findHighlightable(e.target))
    } else {
      this.clear()
    }
  }
}

module.exports = document.registerElement('donkey-editor', Editor)
