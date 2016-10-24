class Command {

  constructor () {
    this.timeStamp = Date.now()
    this.isManipulator = false
  }

  execute () {}
}

donkey.commands.commandBase = Command
module.exports = Command
