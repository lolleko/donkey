exports.initialize = function() {

	const specialKeys = require('../../specialKeys');
	const fileManager = require('../../fileManager');
	const windowEvents = require('../../windowEvents');
	const path = require('path');

	const KeyValue = require('../../KeyValue');
	const ParentKey = require('../../ParentKey');
	const Dota2Value = require('./Dota2Value');
	const Dota2FileValue = require('./Dota2FileValue');
	const Dota2ListValue = require('./Dota2ListValue');
	const Dota2ScriptEditor = require('./Dota2ScriptEditor');

	const FileLeaf = require('../../FileLeaf');

	const dataDir = path.join(__dirname, 'data');
	const templatesDir = path.join(__dirname, 'templates');

	const abilityMenu = [{
		label: 'Add Ability',
		click(menuItem, currentWindow) {
			var template = fileManager.loadDataFromTemplate(path.join(templatesDir, 'ability.txt'));
			var fileLeaf = new FileLeaf(menuItem._pair.getUniqueName('ABILITYNAME'), menuItem._pair.fileName, template);
			menuItem._pair.insertTop(fileLeaf);
			windowEvents.dispatchEvent('selectItem', fileLeaf);
		}
	}, {
		label: 'Add Passive',
		click(menuItem, currentWindow) {
			var template = fileManager.loadDataFromTemplate(path.join(templatesDir, 'ability_passive.txt'));
			var fileLeaf = new FileLeaf(menuItem._pair.getUniqueName('PASSIVENAME'), menuItem._pair.fileName, template);
			menuItem._pair.insertTop(fileLeaf);
			windowEvents.dispatchEvent('selectItem', fileLeaf);
		}
	}];

	const unitMenu = [{
		label: 'Add Unit',
		click(menuItem, currentWindow) {
			var template = fileManager.loadDataFromTemplate(path.join(templatesDir, 'unit.txt'));
			var fileLeaf = new FileLeaf(menuItem._pair.getUniqueName('UNITNAME'), menuItem._pair.fileName, template);
			menuItem._pair.insertTop(fileLeaf);
			windowEvents.dispatchEvent('selectItem', fileLeaf);
		}
	}];

	const itemMenu = [{
		label: 'Add Item',
		click(menuItem, currentWindow) {
			var template = fileManager.loadDataFromTemplate(path.join(templatesDir, 'item.txt'));
			var fileLeaf = new FileLeaf(menuItem._pair.getUniqueName('item_ITEMNAME'), menuItem._pair.fileName, template);
			menuItem._pair.insertTop(fileLeaf);
			windowEvents.dispatchEvent('selectItem', fileLeaf);
		}
	}, {
		label: 'Add Recipe',
		click(menuItem, currentWindow) {
			var name = 'item__recipe_ITEMNAME';
			if (!menuItem._pair.isRoot) {
				name = 'item_recipe_' + menuItem._pair.name.replace('item_', '');
			}
			var template = fileManager.loadDataFromTemplate(path.join(templatesDir, 'item_recipe.txt'));
			var fileLeaf = new FileLeaf(menuItem._pair.getUniqueName(name), menuItem._pair.fileName, template);
			menuItem._pair.insertTop(fileLeaf);
			if (!menuItem._pair.isRoot) {
				fileLeaf.data.set('ItemResult', menuItem._pair.name);
			}
			windowEvents.dispatchEvent('selectItem', fileLeaf);
		}
	}];

	const heroMenu = [{
		label: 'Add Hero',
		click(menuItem, currentWindow) {
			var template = fileManager.loadDataFromTemplate(path.join(templatesDir, 'hero.txt'));
			var fileLeaf = new FileLeaf(menuItem._pair.getUniqueName('npc_dota_hero_HERONAME'), menuItem._pair.fileName, template);
			menuItem._pair.insertTop(fileLeaf);
			windowEvents.dispatchEvent('selectItem', fileLeaf);
		}
	}];

	const abilityParentKeySuggestions = fileManager.fileToJSON(path.join(dataDir, 'suggestions_abilityparent.json'));
	const abilityKeySuggestions = fileManager.fileToJSON(path.join(dataDir, 'suggestions_abilitykey.json'));

	//concat the few item specific suggestions to the ability suggestions
	const itemParentKeySuggestions = abilityParentKeySuggestions.concat(fileManager.fileToJSON(path.join(dataDir, 'suggestions_itemparent.json')));
	const itemKeySuggestions = abilityKeySuggestions.concat(fileManager.fileToJSON(path.join(dataDir, 'suggestions_itemkey.json')));

	const unitParentKeySuggestions = fileManager.fileToJSON(path.join(dataDir, 'suggestions_unitparent.json'));
	const unitKeySuggestions = fileManager.fileToJSON(path.join(dataDir, 'suggestions_unitkey.json'));

	const heroParentKeySuggestions = unitParentKeySuggestions.concat(fileManager.fileToJSON(path.join(dataDir, 'suggestions_heroparent.json')));
	const heroKeySuggestions = unitKeySuggestions.concat(fileManager.fileToJSON(path.join(dataDir, 'suggestions_herokey.json')));

	const commonFiles = {
		'npc_abilities_custom.txt': {
			icon: 'octicon-flame',
			menu: abilityMenu,
			parentKeySuggestions: abilityParentKeySuggestions,
			keySuggestions: abilityKeySuggestions,
			//defaultValueClass: 'Dota2Value',
		},
		'npc_abilities_override.txt': {
			icon: 'octicon-flame',
			menu: abilityMenu,
			parentKeySuggestions: abilityParentKeySuggestions,
			keySuggestions: abilityKeySuggestions,
			defaultValueClass: 'Dota2Value',
		},
		'npc_abilities.txt': {
			icon: 'octicon-flame',
			menu: abilityMenu,
			parentKeySuggestions: abilityParentKeySuggestions,
			keySuggestions: abilityKeySuggestions,
			defaultValueClass: 'Dota2Value',
		},
		'npc_heroes_custom.txt': {
			icon: 'octicon-squirrel',
			menu: 'heroMenu',
			parentKeySuggestions: heroParentKeySuggestions,
			keySuggestions: heroKeySuggestions,
		},
		'npc_items_custom.txt': {
			icon: 'octicon-package',
			menu: itemMenu,
			parentKeySuggestions: itemParentKeySuggestions,
			keySuggestions: itemKeySuggestions,
		},
		'npc_units_custom.txt': {
			icon: 'octicon-squirrel',
			menu: unitMenu,
			parentKeySuggestions: unitParentKeySuggestions,
			keySuggestions: unitKeySuggestions,
		},
		'herolist.txt': {
			icon: 'octicon-gear'
		}
	};

	//default value class
	specialKeys.registerValueClass('Dota2Value', Dota2Value);

	specialKeys.registerValueClass('Dota2File', Dota2FileValue);
	specialKeys.registerValueClass('Dota2List', Dota2ListValue);
	specialKeys.registerValueClass('Dota2ScriptEditor', Dota2ScriptEditor);

	specialKeys.registerGame('Dota2', {
		commonFiles: commonFiles,
	});

	const moveCaps = [
		'DOTA_UNIT_CAP_MOVE_NONE',
		'DOTA_UNIT_CAP_MOVE_GROUND',
		'DOTA_UNIT_CAP_MOVE_FLY'
	];

	specialKeys.registerValue('Dota2', 'DropDown', 'MovementCapabilities', {
		values: moveCaps
	});

	const attackCaps = [
		'DOTA_UNIT_CAP_NO_ATTACK',
		'DOTA_UNIT_CAP_MELEE_ATTACK',
		'DOTA_UNIT_CAP_RANGED_ATTACK'
	];

	specialKeys.registerValue('Dota2', 'DropDown', 'AttackCapabilities', {
		values: attackCaps
	});

	//TeamNames
	const teamNames = fileManager.fileToJSON(path.join(dataDir, 'teamnames.json'));

	specialKeys.registerValue('Dota2', 'DropDown', 'TeamName', {
		values: teamNames
	});

	//Bounds
	const hullSizes = [
		'DOTA_HULL_SIZE_SMALL',
		'DOTA_HULL_SIZE_REGULAR',
		'DOTA_HULL_SIZE_SIEGE',
		'DOTA_HULL_SIZE_HERO',
		'DOTA_HULL_SIZE_HUGE',
		'DOTA_HULL_SIZE_BUILDING',
		'DOTA_HULL_SIZE_FILLER',
		'DOTA_HULL_SIZE_BARRACKS',
		'DOTA_HULL_SIZE_TOWER'
	];

	specialKeys.registerValue('Dota2', 'DropDown', 'BoundsHullName', {
		values: hullSizes
	});

	//var_type
	const varTypes = [
		'FIELD_INTEGER',
		'FIELD_FLOAT',
	];

	specialKeys.registerValue('Dota2', 'DropDown', 'var_type', {
		values: varTypes
	});

	//AbilityType
	const abilityTypes = [
		'DOTA_ABILITY_TYPE_BASIC',
		'DOTA_ABILITY_TYPE_ULTIMATE',
		'DOTA_ABILITY_TYPE_ATTRIBUTES',
		'DOTA_ABILITY_TYPE_HIDDEN'
	];

	specialKeys.registerValue('Dota2', 'DropDown', 'AbilityType', {
		values: abilityTypes
	});

	//UnitTargeting
	//Team
	const abilityUnitTargetTeam = [
		'DOTA_UNIT_TARGET_TEAM_BOTH',
		'DOTA_UNIT_TARGET_TEAM_ENEMY',
		'DOTA_UNIT_TARGET_TEAM_FRIENDLY',
		'DOTA_UNIT_TARGET_TEAM_NONE',
		'DOTA_UNIT_TARGET_TEAM_CUSTOM'
	];

	specialKeys.registerValue('Dota2', 'DropDown', 'AbilityUnitTargetTeam', {
		values: abilityUnitTargetTeam
	});

	//Type
	const abilityUnitTargetType = [
		'DOTA_UNIT_TARGET_ALL',
		'DOTA_UNIT_TARGET_HERO',
		'DOTA_UNIT_TARGET_BASIC',
		'DOTA_UNIT_TARGET_CREEP',
		'DOTA_UNIT_TARGET_TREE',
		'DOTA_UNIT_TARGET_BUILDING',
		'DOTA_UNIT_TARGET_COURIER',
		'DOTA_UNIT_TARGET_MECHANICAL',
		'DOTA_UNIT_TARGET_NONE',
		'DOTA_UNIT_TARGET_OTHER',
		'DOTA_UNIT_TARGET_CUSTOM'
	];
	specialKeys.registerValue('Dota2', 'FlagSelector', 'AbilityUnitTargetType', {
		flags: abilityUnitTargetType
	});

	//DamageTpye
	const abilityUnitDamageType = [
		'DAMAGE_TYPE_MAGICAL',
		'DAMAGE_TYPE_PHYSICAL',
		'DAMAGE_TYPE_PURE',
	];
	specialKeys.registerValue('Dota2', 'DropDown', 'AbilityUnitDamageType', {
		values: abilityUnitDamageType
	});

	//CombatClass
	const combatClassAttack = [
		'DOTA_COMBAT_CLASS_ATTACK_BASIC',
		'DOTA_COMBAT_CLASS_ATTACK_PIERCE',
		'DOTA_COMBAT_CLASS_ATTACK_SIEGE',
		'DOTA_COMBAT_CLASS_ATTACK_LIGHT',
		'DOTA_COMBAT_CLASS_ATTACK_HERO'
	];

	const combatClassDefend = [
		'DOTA_COMBAT_CLASS_DEFEND_SOFT',
		'DOTA_COMBAT_CLASS_DEFEND_WEAK',
		'DOTA_COMBAT_CLASS_DEFEND_BASIC',
		'DOTA_COMBAT_CLASS_DEFEND_STRONG',
		'DOTA_COMBAT_CLASS_DEFEND_STRUCTURE',
		'DOTA_COMBAT_CLASS_DEFEND_HERO'
	];

	specialKeys.registerValue('Dota2', 'DropDown', 'CombatClassAttack', {
		values: combatClassAttack
	});
	specialKeys.registerValue('Dota2', 'DropDown', 'CombatClassDefend', {
		values: combatClassDefend
	});

	//The Target Key
	const targets = [
		'CASTER',
		'TARGET',
		'ATTACKER',
		'UNIT',
		'POINT',
		'PROJECTILE'
	];

	specialKeys.registerValue('Dota2', 'DropDown', 'Target', {
		values: targets
	});
	specialKeys.registerValue('Dota2', 'DropDown', 'Center', {
		values: targets
	});

	//TargetFlags
	const abilityUnitTargetFlags = [
		'DOTA_UNIT_TARGET_FLAG_DEAD',
		'DOTA_UNIT_TARGET_FLAG_MELEE_ONLY',
		'DOTA_UNIT_TARGET_FLAG_RANGED_ONLY',
		'DOTA_UNIT_TARGET_FLAG_MANA_ONLY',
		'DOTA_UNIT_TARGET_FLAG_CHECK_DISABLE_HELP',
		'DOTA_UNIT_TARGET_FLAG_NO_INVIS',
		'DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES',
		'DOTA_UNIT_TARGET_FLAG_NOT_MAGIC_IMMUNE_ALLIES',
		'DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE',
		'DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE',
		'DOTA_UNIT_TARGET_FLAG_INVULNERABLE',
		'DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS',
		'DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO',
		'DOTA_UNIT_TARGET_FLAG_NOT_DOMINATED',
		'DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS',
		'DOTA_UNIT_TARGET_FLAG_NOT_NIGHTMARED',
		'DOTA_UNIT_TARGET_FLAG_NOT_SUMMONED',
		'DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD',
		'DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED',
		'DOTA_UNIT_TARGET_FLAG_PREFER_ENEMIES',
		'DOTA_UNIT_TARGET_FLAG_NONE'
	];

	specialKeys.registerValue('Dota2', 'FlagSelector', 'AbilityUnitTargetFlags', {
		flags: abilityUnitTargetFlags
	});

	//Ability Flags
	const abilityBehaviours = [
		'DOTA_ABILITY_BEHAVIOR_NO_TARGET',
		'DOTA_ABILITY_BEHAVIOR_UNIT_TARGET',
		'DOTA_ABILITY_BEHAVIOR_POINT',
		'DOTA_ABILITY_BEHAVIOR_PASSIVE',
		'DOTA_ABILITY_BEHAVIOR_CHANNELLED',
		'DOTA_ABILITY_BEHAVIOR_TOGGLE',
		'DOTA_ABILITY_BEHAVIOR_AURA',
		'DOTA_ABILITY_BEHAVIOR_AUTOCAST',
		'DOTA_ABILITY_BEHAVIOR_HIDDEN',
		'DOTA_ABILITY_BEHAVIOR_AOE',
		'DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE',
		'DOTA_ABILITY_BEHAVIOR_ITEM',
		'DOTA_ABILITY_BEHAVIOR_DIRECTIONAL',
		'DOTA_ABILITY_BEHAVIOR_IMMEDIATE',
		'DOTA_ABILITY_BEHAVIOR_NOASSIST',
		'DOTA_ABILITY_BEHAVIOR_ATTACK',
		'DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES',
		'DOTA_ABILITY_BEHAVIOR_UNRESTRICTED',
		'DOTA_ABILITY_BEHAVIOR_DONT_ALERT_TARGET',
		'DOTA_ABILITY_BEHAVIOR_DONT_RESUME_MOVEMENT',
		'DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK',
		'DOTA_ABILITY_BEHAVIOR_NORMAL_WHEN_STOLEN',
		'DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING',
		'DOTA_ABILITY_BEHAVIOR_IGNORE_PSEUDO_QUEUE',
		'DOTA_ABILITY_BEHAVIOR_RUNE_TARGET',
		'DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL',
		'DOTA_ABILITY_BEHAVIOR_OPTIONAL_UNIT_TARGET',
		'DOTA_ABILITY_BEHAVIOR_OPTIONAL_NO_TARGET'
	];

	specialKeys.registerValue('Dota2', 'FlagSelector', 'AbilityBehavior', {
		flags: abilityBehaviours
	});

	//Unit bools
	specialKeys.registerValue('Dota2', 'CheckBox', 'ConsideredHero', {
		on: '1',
		off: '0'
	});
	specialKeys.registerValue('Dota2', 'CheckBox', 'UseNeutralCreepBehavior', {
		on: '1',
		off: '0'
	});
	specialKeys.registerValue('Dota2', 'CheckBox', 'HasInventory', {
		on: '1',
		off: '0'
	});
	specialKeys.registerValue('Dota2', 'CheckBox', 'IsSummoned', {
		on: '1',
		off: '0'
	});
	specialKeys.registerValue('Dota2', 'CheckBox', 'CanBeDominated', {
		on: '1',
		off: '0'
	});
	specialKeys.registerValue('Dota2', 'CheckBox', 'IsAncient', {
		on: '1',
		off: '0'
	});
	specialKeys.registerValue('Dota2', 'CheckBox', 'IsNeutralUnitType', {
		on: '1',
		off: '0'
	});
	specialKeys.registerValue('Dota2', 'CheckBox', 'AutoAttacksByDefault', {
		on: '1',
		off: '0'
	});
	specialKeys.registerValue('Dota2', 'CheckBox', 'ShouldDoFlyHeightVisual', {
		on: '1',
		off: '0'
	});
	specialKeys.registerValue('Dota2', 'CheckBox', 'WakesNeutrals', {
		on: '1',
		off: '0'
	});

	//Ability Bools
	specialKeys.registerValue('Dota2', 'CheckBox', 'ProvidesVision', {
		on: '1',
		off: '0'
	});
	specialKeys.registerValue('Dota2', 'CheckBox', 'HasFrontalCone', {
		on: '1',
		off: '0'
	});
	specialKeys.registerValue('Dota2', 'CheckBox', 'IsFixedDistance', {
		on: '1',
		off: '0'
	});
	specialKeys.registerValue('Dota2', 'CheckBox', 'ShouldStun', {
		on: '1',
		off: '0'
	});
	specialKeys.registerValue('Dota2', 'CheckBox', 'DeleteOnHit', {
		on: '1',
		off: '0'
	});
	specialKeys.registerValue('Dota2', 'CheckBox', 'CastFilterRejectCaster', {
		on: '1',
		off: '0'
	});

	//Modifier Bools
	specialKeys.registerValue('Dota2', 'CheckBox', 'Passive', {
		on: '1',
		off: '0'
	});
	specialKeys.registerValue('Dota2', 'CheckBox', 'IsHidden', {
		on: '1',
		off: '0'
	});
	specialKeys.registerValue('Dota2', 'CheckBox', 'IsDebuff', {
		on: '1',
		off: '0'
	});
	specialKeys.registerValue('Dota2', 'CheckBox', 'IsPurgable', {
		on: '1',
		off: '0'
	});
	specialKeys.registerValue('Dota2', 'CheckBox', 'IsBuff', {
		on: '1',
		off: '0'
	});
	specialKeys.registerValue('Dota2', 'CheckBox', 'Aura_ApplyToCaster', {
		on: '1',
		off: '0'
	});

	const modifierStates = fileManager.fileToJSON(path.join(dataDir, 'modifierStates.json'));

	for (var i = 0; i < modifierStates.length; i++) {
		specialKeys.registerValue('Dota2', 'CheckBox', modifierStates[i], {
			on: 'MODIFIER_STATE_VALUE_ENABLED',
			off: 'MODIFIER_STATE_VALUE_DISABLED'
		});
	}

	//HeroLsit triStates
	const heroes = fileManager.fileToJSON(path.join(dataDir, 'herolist.json'));

	for (var i = 0; i < heroes.length; i++) {
		specialKeys.registerValue('Dota2', 'TriStateCheckBox', heroes[i], {
			on: '1',
			off: '0',
			indeterminate: '-1'
		});
	}

	specialKeys.registerValue('Dota2', 'List', 'override_hero', {
		values: heroes,
		minChars: 15
	});

	//File inputs
	specialKeys.registerValue('Dota2', 'Dota2File', 'ScriptFile', {
		defaultPath: 'scripts/vscripts',
		relativePaths: [{
			path: 'scripts/vscripts'
		}]
	});

	specialKeys.registerValue('Dota2', 'Dota2File', 'vscripts', {
		defaultPath: 'scripts/vscripts',
		relativePaths: [{
			path: 'scripts/vscripts'
		}]
	});

	specialKeys.registerValue('Dota2', 'Dota2File', 'AbilityTextureName', {
		defaultPath: 'resource/flash3/images',
		relativePaths: [{
			path: 'resource/flash3/images/spellicons'
		}, {
			path: 'resource/flash3/images/items',
			prefix: 'item_'
		}],
		stripExtenstion: true
	});

	specialKeys.registerValue('Dota2', 'Dota2ScriptEditor', 'Function', {});

	//List (autocomplete)
	const actions = fileManager.fileToJSON(path.join(dataDir, 'actions.json'));

	specialKeys.registerValue('Dota2', 'List', 'AbilityCastAnimation', {
		values: actions,
		minChars: 5
	});

	specialKeys.registerValue('Dota2', 'Dota2List', 'Ability1', {
		file: 'npc_abilities_custom.txt'
	});
	specialKeys.registerValue('Dota2', 'Dota2List', 'Ability2', {
		file: 'npc_abilities_custom.txt'
	});
	specialKeys.registerValue('Dota2', 'Dota2List', 'Ability3', {
		file: 'npc_abilities_custom.txt'
	});
	specialKeys.registerValue('Dota2', 'Dota2List', 'Ability4', {
		file: 'npc_abilities_custom.txt'
	});
	specialKeys.registerValue('Dota2', 'Dota2List', 'Ability5', {
		file: 'npc_abilities_custom.txt'
	});
	specialKeys.registerValue('Dota2', 'Dota2List', 'Ability6', {
		file: 'npc_abilities_custom.txt'
	});
	specialKeys.registerValue('Dota2', 'Dota2List', 'Ability7', {
		file: 'npc_abilities_custom.txt'
	});
	specialKeys.registerValue('Dota2', 'Dota2List', 'Ability8', {
		file: 'npc_abilities_custom.txt'
	});
	specialKeys.registerValue('Dota2', 'Dota2List', 'Ability9', {
		file: 'npc_abilities_custom.txt'
	});
	specialKeys.registerValue('Dota2', 'Dota2List', 'Ability10', {
		file: 'npc_abilities_custom.txt'
	});
	specialKeys.registerValue('Dota2', 'Dota2List', 'Ability11', {
		file: 'npc_abilities_custom.txt'
	});
	specialKeys.registerValue('Dota2', 'Dota2List', 'Ability12', {
		file: 'npc_abilities_custom.txt'
	});
	specialKeys.registerValue('Dota2', 'Dota2List', 'Ability13', {
		file: 'npc_abilities_custom.txt'
	});
	specialKeys.registerValue('Dota2', 'Dota2List', 'Ability14', {
		file: 'npc_abilities_custom.txt'
	});
	specialKeys.registerValue('Dota2', 'Dota2List', 'Ability15', {
		file: 'npc_abilities_custom.txt'
	});
	specialKeys.registerValue('Dota2', 'Dota2List', 'Ability16', {
		file: 'npc_abilities_custom.txt'
	});
	specialKeys.registerValue('Dota2', 'Dota2List', 'Ability17', {
		file: 'npc_abilities_custom.txt'
	});
	specialKeys.registerValue('Dota2', 'Dota2List', 'Ability18', {
		file: 'npc_abilities_custom.txt'
	});
	specialKeys.registerValue('Dota2', 'Dota2List', 'Ability19', {
		file: 'npc_abilities_custom.txt'
	});
	specialKeys.registerValue('Dota2', 'Dota2List', 'Ability20', {
		file: 'npc_abilities_custom.txt'
	});

	specialKeys.registerValue('Dota2', 'Dota2List', 'UnitName', {
		file: 'npc_units_custom.txt'
	});

	//Menus
	const abilitySpecialMenu = [{
		label: 'Add Variable',
		click(menuItem, currentWindow) {
			var index = menuItem._pair.size + 1;
			if (index < 10) {
				index = '0' + index;
			} else {
				index = '' + index;
			}
			var pk = new ParentKey(index, new Map(), menuItem._pair);
			var varType = new KeyValue('var_type', 'FIELD_INTEGER', pk);
			pk.add(varType);
			var nameVal = new KeyValue('VARIABLENAME', 'VARIABLEVALUE', pk);
			pk.add(nameVal);
			menuItem._pair.add(pk);
			nameVal.element.getElementsByTagName('input')[0].select();
		}
	}, {
		label: 'Remove Last Variable',
		click(menuItem, currentWindow) {
			var index = menuItem._pair.size - 1;
			menuItem._pair.remove(menuItem._pair.getByIndex(index));
		}
	}];

	specialKeys.registerKeyMenu('Dota2', abilitySpecialMenu, 'AbilitySpecial');

};
