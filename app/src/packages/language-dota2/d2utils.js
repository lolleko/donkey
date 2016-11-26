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

exports.editMetaData = (targetName, kvPath, placeholder) => {
  if (!kvPath.substring(0, kvPath.lastIndexOf('//')).includes('DOTAAbilities')) {
    return
  }
  var parentData = donkey.files.readData(kvPath.substring(0, kvPath.lastIndexOf('//')))
  var comment = parentData.getBefore(targetName)
  var commentKey
  var commentData
  if (comment && comment[0].includes(donkey.files.KVMACRO_COMMENT)) {
    commentKey = comment[0]
    try {
      commentData = donkey.files.getParser('kv1').parse(comment[1])
    } catch (e) {
      // silently fail
    }
  }

  var data = new VDFMap(placeholder)
  if (commentData) {
    for (var [key, value] of commentData) {
      if (data.has(key)) {
        data.set(key, value)
      }
    }
  }
  donkey.dialog.showInputDialog({title: 'Tooltip Data for: ' + targetName, type: 'kveditor', data: data}, (result) => {
    if (!result) {
      return
    }
    // skip empty field
    for (var [key, value] of result) {
      if (value === '') {
        result.delete(key)
      }
    }
    var resultStr = donkey.files.getParser('kv1').stringify(result)
    if (commentKey) {
      parentData.set(commentKey, resultStr)
    } else {
      parentData.insertBefore(donkey.files.getCommentMacro(), resultStr, targetName)
    }
    donkey.files.write(kvPath)
  })
}
