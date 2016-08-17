exports.initialize = function() {

	const specialKeys = require('../../specialKeys');
	const fileManager = require('../../fileManager');
	const windowEvents = require('../../windowEvents');

	const path = require('path');

	const Value = require('./Value');
	const KeyValue = require('../../KeyValue');
	const ParentKey = require('../../ParentKey');
	const FileLeaf = require('../../FileLeaf');
	const DropDownValue = require('./DropDownValue');
	const ListValue = require('./ListValue');
	const FlagSelectorValue = require('./FlagSelectorValue');
	const CheckBoxValue = require('./CheckBoxValue');
	const TriStateCheckBoxValue = require('./TriStateCheckBoxValue');
	const FileValue = require('./FileValue');

	//DefaultPairMenu
	const defaultPairMenu = [
		{
			label: 'Add KeyValue',
			click(menuItem, currentWindow) {
				var i = 0;
				var suffix = '';
				while (menuItem._pair.data.has('NEWKEY' + suffix)) {
					i++;
					suffix = i;
				}
				var kv = new KeyValue('NEWKEY' + suffix, 'NEWVALUE');
				menuItem._pair.insertTop(kv);
				kv.element.getElementsByTagName('input')[0].select();
			}
		},
		{
			label: 'Add ParentKey',
			click(menuItem, currentWindow) {
				var i = 0;
				var suffix = '';
				while (menuItem._pair.data.has('NEWPARENT' + suffix)) {
					i++;
					suffix = i;
				}
				var pk = new ParentKey('NEWPARENT' + suffix);
				menuItem._pair.insertTop(pk);
				pk.element.getElementsByTagName('input')[0].select();
			}
		},
		{
			label: 'Remove KeyValue / ParentKey',
			click(menuItem, currentWindow) {
				if (!menuItem._pair.isRoot) {
					menuItem._pair.parent.remove(menuItem._pair);
				} else {
					//TODO cant delete root
				}
			}
		}
	];

	//defaultFileMenu
	const defaultFileMenu = [
		{
			label: 'Add',
			click(menuItem, currentWindow) {
				var fileLeaf = new FileLeaf(menuItem._pair.getUniqueName('NEWPARENT'), menuItem._pair.fileName);
				menuItem._pair.insertTop(fileLeaf);
				menuItem._pair.reload();
				windowEvents.dispatchEvent('selectItem', fileLeaf);
			}
		},
		{
			label: 'Delete',
			click(menuItem, currentWindow) {
				// if deleted item was open select nothing
				if (fileManager.getCurrentRoot() && fileManager.getCurrentRoot().key == menuItem._pair.name) {
					windowEvents.dispatchEvent("selectItem");
				}
				if (menuItem._pair.isRoot) {
					menuItem._pair.removeSelf();
					fileManager.deleteFile(menuItem._pair.name);
				} else {
					menuItem._pair.parent.remove(menuItem._pair);
				}
			}
		},
		{
			label: 'Duplicate',
			click(menuItem, currentWindow) {
				if (menuItem._pair.isRoot) {
					fileManager.newFile(menuItem._pair.fileName + '_copy', menuItem._pair.parent.data);
				} else {
					var fileLeaf = new FileLeaf(menuItem._pair.getUniqueName(menuItem._pair.name + '_copy'), menuItem._pair.fileName, new Map(menuItem._pair.data));
					menuItem._pair.insertTop(fileLeaf);
					windowEvents.dispatchEvent('selectItem', fileLeaf);
				}
			}
		},
		{
			label: 'Rename[NOT YET IMPLEMENTED]',
			click(menuItem, currentWindow) {
			}
		}

	];

	specialKeys.registerGame('KeyValue', {
		commonFiles : {},
		defaultValueClass : 'Value'
	});

	specialKeys.registerDefaultKeyMenu(defaultPairMenu);
	specialKeys.registerDefaultFileMenu(defaultFileMenu);

	specialKeys.setDefaultGame('KeyValue');

	//register default value class
	specialKeys.registerValueClass('Value', Value);

	specialKeys.registerValueClass('DropDown', DropDownValue);
	specialKeys.registerValueClass('List', ListValue);
	specialKeys.registerValueClass('FlagSelector', FlagSelectorValue);
	specialKeys.registerValueClass('CheckBox', CheckBoxValue);
	specialKeys.registerValueClass('TriStateCheckBox', TriStateCheckBoxValue);
	specialKeys.registerValueClass('File', FileValue);
}
