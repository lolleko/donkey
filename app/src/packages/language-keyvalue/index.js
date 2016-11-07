const path = require('path')
const fs = require('fs')

var menus = fs.readdirSync(path.join(__dirname, '/menus'))
for (var j = 0; j < menus.length; j++) {
  require('./menus/' + menus[j])
}
