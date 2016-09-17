class Dota2EditFunction extends donkey.valueElements.openfile {
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
}
module.exports = document.registerElement('dota2-edit-function-value', Dota2EditFunction)
