const path = require('path')

exports.sep = '//'

exports.join = function () {
  var joined = ''
  for (var i = 0; i < arguments.length; ++i) {
    var arg = arguments[i]
    if (arg && arg.length > 0) {
      var arr = this.toArray(arg)
      for (var j = 0; j < arr.length; ++j) {
        if (i === 0 && j === 0) {
          joined = arr[j]
        } else {
          joined += this.sep + arr[j]
        }
      }
    }
  }
  return joined
}

exports.basename = (kvpath) => {
  return path.basename(kvpath.split(this.sep).pop())
}

exports.filepath = (kvpath) => {
  return kvpath.split(this.sep).shift()
}

exports.filename = (kvpath) => {
  return path.basename(this.filepath(kvpath))
}

exports.stripfile = (kvpath) => {
  var arr = this.toArray(kvpath)
  arr.shift()
  return arr.join(this.sep)
}

exports.toArray = (kvpath) => {
  return kvpath.split(this.sep).filter(v => v !== '')
}
