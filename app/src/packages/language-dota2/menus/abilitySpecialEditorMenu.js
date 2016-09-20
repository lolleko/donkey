const abilitySpecialMenu = [{
  label: 'Add Variable',
  click (menuItem, currentWindow) {
    var parent = document.createElement('parent-key')
    parent.key = '0' + (menuItem.target.inner.children.length + 1)
    var type = document.createElement('key-value')
    type.key = 'var_type'
    type.value = 'FIELD_FLOAT'
    parent.appendChild(type)
    var variable = document.createElement('key-value')
    variable.key = 'VARNAME'
    variable.value = 'VARVALUE'
    parent.appendChild(variable)
    menuItem.target.appendChild(parent)
    variable.focus()
    variable.select()
  }
}]
module.exports = donkey.lang.registerMenu('Dota2AbilitySpecialEditorMenu', abilitySpecialMenu)
