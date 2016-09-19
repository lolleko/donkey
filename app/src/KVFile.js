const path = require('path')
const fs = require('fs')
const vdf = require('./vdf')

/**
 * Class that represents a file on the system.
 * Rather than saving the file's content as string this class will
 * hold a data Map generated form the file's kv string.
 */
class KVFile {
  constructor (pathName) {
    this.name = path.basename(pathName)
    this.path = pathName
    this.modified = false

    // makesure the file exists
    try {
      fs.statSync(this.path).isFile()
    } catch (e) {
      fs.writeFileSync(this.path, '', 'utf8')
    }

    this.stats = fs.statSync(this.path)

    this.data = vdf.parse(fs.readFileSync(this.path, 'utf8'))
    this.category = donkey.lang.detectCategory(this.data)
  }

  /**
   * Write the current data to the file.
   */
  write () {
    var vdfDump = vdf.dump(this.data)

    fs.writeFile(this.path, vdfDump, (err) => {
      if (err) throw err
    })

    var that = this
    fs.stat(this.path, (err, stats) => {
      if (err) throw err
      that.stats = stats
    })
  }

  /**
   * TODO
   */
  close () {}

  /**
   * Delete the file from the system.
   * This will just delete the file not this object.
   */
  unlink () {
    fs.unlink(this.path, (err) => {
      if (err) throw err
    })
  }

  /**
   * Rename the file on the system.
   * @param {string} newPath the new path/name.
   */
  rename (newPath) {
    var that = this
    fs.rename(this.path, newPath, (err) => {
      if (err) throw err
    })
    that.path = newPath
    this.name = path.basename(newPath)
  }

  updateCategory () {
    this.category = donkey.lang.detectCategory(this.data)
  }

}

module.exports = KVFile
