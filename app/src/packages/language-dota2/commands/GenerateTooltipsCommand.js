const d2utils = require('./../d2utils')
const path = require('path')
const fs = require('fs')

class Dota2GenerateTooltipsCommand extends Command {
  execute () {
    var npcDir = path.join(d2utils.getAddonGameDir(donkey.files.activeFilePath), 'scripts', 'npc')

    var unitsPath = path.join(npcDir, 'npc_units_custom.txt')
    var abilitiesPath = path.join(npcDir, 'npc_abilities_custom.txt')
    var itemsPath = path.join(npcDir, 'npc_items_custom.txt')

    var tooltipData = new VDFMap()

    // UNIT NAME STRINGS
    tooltipData.set(donkey.files.getCommentMacro(), 'UNIT NAMES')

    var unitsData = donkey.files.getParser('kv1').parse(fs.readFileSync(unitsPath, 'utf8')).get('DOTAUnits')

    this.generateUnitNames(unitsData, tooltipData)

    // Abilities
    tooltipData.set(donkey.files.getCommentMacro(), 'ABILITIES')

    var abilitiesData = donkey.files.getParser('kv1').parse(fs.readFileSync(abilitiesPath, 'utf8')).get('DOTAAbilities')

    this.generateAbilityTooltips(abilitiesData, tooltipData)

    // Items
    tooltipData.set(donkey.files.getCommentMacro(), 'ITEMS')

    var itemsData = donkey.files.getParser('kv1').parse(fs.readFileSync(itemsPath, 'utf8')).get('DOTAAbilities')

    this.generateAbilityTooltips(itemsData, tooltipData)

    var resultPath = path.join(d2utils.getAddonContentDir(donkey.files.activeFilePath), 'generated_tooltips.txt')

    donkey.files.add(resultPath)
    donkey.files.writeData(resultPath, tooltipData)
  }

  capitalizeFirst (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  generateUnitNames (data, result) {
    for (var [key, value] of data) {
      if (typeof value !== 'string') {
        var name = key
        var meta = data.getBefore(key)
        if (meta && meta[0].includes(donkey.files.KVMACRO_COMMENT)) {
          var metaData = donkey.files.getParser('kv1').parse(meta[1])
          if (metaData.has('Name')) {
            name = metaData.get('Name')
          }
        } else {
          var nameArr = key.split('_')
          var namePartOne = nameArr[nameArr.length - 2]
          var namePartTwo = nameArr[nameArr.length - 1]
          name = this.capitalizeFirst(namePartOne) + ' ' + this.capitalizeFirst(namePartTwo)
        }

        result.set(key, name)
      }
    }
  }

  generateAbilityTooltips (data, result) {
    for (var [key, value] of data) {
      if (typeof value !== 'string') {
        var prefix = 'DOTA_Tooltip_ability_' + key + '_'
        var meta = data.getBefore(key)

        var nameArr = key.split('_')
        var namePartOne = nameArr[nameArr.length - 2]
        var namePartTwo = nameArr[nameArr.length - 1]
        var name = this.capitalizeFirst(namePartOne) + ' ' + this.capitalizeFirst(namePartTwo)

        var description = '', lore = '', note0 = '', note1 = ''

        if (meta && meta[0].includes(donkey.files.KVMACRO_COMMENT)) {
          var metaData = donkey.files.getParser('kv1').parse(meta[1])
          if (metaData.has('Name')) {
            name = metaData.get('Name')
          }
          if (metaData.has('Description')) {
            description = metaData.get('Description')
          }
          if (metaData.has('Lore')) {
            lore = metaData.get('Lore')
          }
          if (metaData.has('Note0')) {
            note0 = metaData.get('Note0')
          }
          if (metaData.has('Note1')) {
            note1 = metaData.get('Note1')
          }
        }

        result.set(prefix, name)

        if (description) {
          result.set(prefix + 'Description', description)
        }
        if (lore) {
          result.set(prefix + 'Lore', lore)
        }
        if (note0) {
          result.set(prefix + 'Note0', note0)
        }
        if (note1) {
          result.set(prefix + 'Note1', note1)
        }

        // AbilitySpecial
        if (value.has('AbilitySpecial')) {
          for (var [, value1] of value.get('AbilitySpecial')) {
            if (typeof value1 !== 'string') {
              for (var [key2] of value1) {
                if (key2 !== 'vart_type') {
                  result.set(prefix + key2, key2.toUpperCase().replace(/_/g, ' ') + ':')
                }
              }
            }
          }
        }
      }
    }
  }
}

module.exports = donkey.commands.add('dota2:generatetooltips', Dota2GenerateTooltipsCommand)
