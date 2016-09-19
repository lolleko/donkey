const fs = require('fs')

class Dota2EditFunction extends donkey.valueElements.openfile {

  attachedCallback () {
    super.attachedCallback()
    this.input.values = this.getFunctionsInFile()
  }

  getFileToOpen () {
    var siblings = this.parentNode.parentNode.children
    var filePath
    for (var i = 0; i < siblings.length; i++) {
      var sibling = siblings[i]
      if (sibling.valueElement.tagName === 'DOTA2-FILE-VALUE') {
        filePath = sibling.valueElement.absolutePath
      }
    }
    return filePath
  }

  getFunctionsInFile () {
    var file = this.getFileToOpen()
    try {
      fs.statSync(file).isFile()
    } catch (e) {
      return []
    }
    if (file) {
      var lineArr = fs.readFileSync(file, 'utf8').split('\n')
      var result = []
      for (var i = 0; i < lineArr.length; i++) {
        var line = lineArr[i]
        if (line.includes('function')) {
          line = line.replace('function', '')
          line = line.replace(/\(.*?\)/g, '')
          line = line.trim()
          result.push(line)
        }
      }
      return result
    } else {
      return []
    }
  }
}
module.exports = document.registerElement('dota2-edit-function-value', Dota2EditFunction)
