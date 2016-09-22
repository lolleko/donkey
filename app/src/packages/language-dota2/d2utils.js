/*
  Module that provides utility functions.
  To retrieve dota addon related paths from an absolute path.
 */

const path = require('path')

exports.getGameRoot = (filePath) => {
  var filePathArr = filePath.split(path.sep)
  while (filePathArr.length > 0) {
    var current = filePathArr.pop()
    if (current === 'content' || current === 'game') {
      if (process.platform !== 'win32') {
        return path.join('/', ...filePathArr)
      } else {
        return path.join(...filePathArr)
      }
    }
  }
  return null
}

exports.getContentDir = (filePath) => {
  var root = exports.getGameRoot(filePath)
  if (root) {
    return path.join(root, 'content')
  } else {
    return null
  }
}

exports.getGameDir = (filePath) => {
  var root = exports.getGameRoot(filePath)
  if (root) {
    return path.join(root, 'game')
  } else {
    return null
  }
}

exports.getAddonName = (filePath) => {
  var filePathArr = filePath.split(path.sep)
  for (var i = filePathArr.length; i >= 0; i--) {
    if (filePathArr[i] === 'dota_addons') {
      return filePathArr[i + 1]
    }
  }
  return null
}

exports.getAddonContentDir = (filePath) => {
  return path.join(exports.getGameRoot(filePath), 'content', 'dota_addons', exports.getAddonName(filePath))
}

exports.getAddonGameDir = (filePath) => {
  return path.join(exports.getGameRoot(filePath), 'game', 'dota_addons', exports.getAddonName(filePath))
}
