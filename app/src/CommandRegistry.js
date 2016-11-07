const ipc = require('electron').ipcRenderer

/**
 * Stores all registered commands.
 * An instance of this object is stored at `donkey.commands`
 */
class CommandRegistry {
  constructor () {
    this.commands = {}
  }

  /**
   * Add a commadn to the command registry
   * @param  {string} name The name fo the added command
   * @param  {Command} proto the command prototype
   * @param  {Object=} options command options:
   * @param  {Boolean} [options.executeGlobal] Wether the command can be executed without active editor
   * @param  {String} [options.accelerator] [Accelerator](https://github.com/electron/electron/blob/master/docs/api/accelerator.md) key
   * @return {Command} The added prototype
   */
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

  /**
   * Execute a command. This will execute the command in the active editor or
   * global if optption "executeGlobal" is set.
   * @param  {String} name The name of the command
   * @param  {...*} [params] Command specific parameters parameters.
   * @return {Command} The instance of the executed command
   */
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
        var cmd = new CmdProto(...args)
        cmd.execute()
        return command
      } else if (donkey.editor) {
        return donkey.editor.execCommand(new CmdProto(...args))
      }
    }
  }

  /**
   * Retreives a command by its name(id)
   * @param  {string} name the name(id) of the command
   * @return {Command} the prototype of the command
   */
  get (name) {
    return this.commands[name].proto
  }
}

module.exports = CommandRegistry
