const ipc = require('electron').ipcRenderer

class CommandRegistry {
  constructor () {
    this.commands = {}
  }

  add (name, proto, options) {
    options = options || {}
    var executeGlobal = options.executeGlobal || false
    this.commands[name] = {proto: proto, executeGlobal: executeGlobal}

    if (options.accelerator) {
      donkey.keys.register(options.accelerator, name)
    }
    ipc.on('command:' + name, function (e) {
      var args = []
      for (var i = 1; i < arguments.length; i++) {
        args.push(arguments[i])
      }
      donkey.commands.exec(name, ...args)
    })

    return proto
  }

  exec () {
    if (this.commands[arguments[0]]) {
      var name = arguments[0]
      var command = this.commands[name]
      var args = []
      for (var i = 1; i < arguments.length; i++) {
        args.push(arguments[i])
      }
      var CmdProto = command.proto
      if (command.executeGlobal) {
        new CmdProto(...args).execute()
      } else if (donkey.editor) {
        donkey.editor.execCommand(new CmdProto(...args))
      }
    }
  }

  get (name) {
    return this.commands[name]
  }
}

module.exports = CommandRegistry
