class Command {

  constructor () {
    this.timeStamp = Date.now()
    this.isManipulator = false
  }

  execute () {}
}

module.exports = Command
