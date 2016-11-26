class Dota2AddAbilitySpecialVariableCommand extends UndoableCommand {
  constructor (element, name) {
    super()

    this.element = element
    this.name = name || 'NEWKEY'
  }

  execute () {
    if (this.element) {
      var parent = document.createElement('parent-key')
      parent.key = this.name
      this.addedElement = this.element.insertAtEnd(parent)

      var variable = document.createElement('key-value')
      variable.key = 'VARNAME'
      variable.value = 'VARVALUE'
      parent.insert(variable)

      var type = document.createElement('key-value')
      type.key = 'var_type'
      type.value = 'FIELD_FLOAT'
      parent.insert(type)

      variable.focus()
      variable.select()
    }
  }

  undo () {
    this.addedElement.parentNode.removeChild(this.addedElement)
  }
}

module.exports = donkey.commands.add('dota2:addabilityspecialvar', Dota2AddAbilitySpecialVariableCommand)
