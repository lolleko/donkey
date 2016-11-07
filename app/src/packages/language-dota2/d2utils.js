/**
 * Module that provides utility functions.
 * To retrieve dota addon related paths from an absolute path.
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
  return undefined
}

exports.getContentDir = (filePath) => {
  var root = exports.getGameRoot(filePath)
  if (root) {
    return path.join(root, 'content')
  } else {
    return undefined
  }
}

exports.getGameDir = (filePath) => {
  var root = exports.getGameRoot(filePath)
  if (root) {
    return path.join(root, 'game')
  } else {
    return undefined
  }
}

exports.getAddonName = (filePath) => {
  var filePathArr = filePath.split(path.sep)
  for (var i = filePathArr.length; i >= 0; i--) {
    if (filePathArr[i] === 'dota_addons') {
      return filePathArr[i + 1]
    }
  }
  return undefined
}

exports.getAddonContentDir = (filePath) => {
  var gameRoot = exports.getGameRoot(filePath)
  var addonName = exports.getAddonName(filePath)
  if (!gameRoot || !addonName) {
    return undefined
  }
  return path.join(gameRoot, 'content', 'dota_addons', addonName)
}

exports.getAddonGameDir = (filePath) => {
  var gameRoot = exports.getGameRoot(filePath)
  var addonName = exports.getAddonName(filePath)
  if (!gameRoot || !addonName) {
    return undefined
  }
  return path.join(gameRoot, 'game', 'dota_addons', addonName)
}
