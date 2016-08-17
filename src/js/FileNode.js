const windowEvents = require('./windowEvents');
const specialKeys = require('./specialKeys');
const path = require('path');
const Pair = require('./Pair');
const Menu = require('electron').remote.Menu;

class FileNode extends Pair {
	constructor(name, fileName, data, parent) {
		super();
		this._name = name;
		this._fileName = fileName;
		this._data = data || new Map();
		this._parent = parent;
		this._isNav = true;
	}

	get name() {
		return this._name;
	}

	set name(name) {
		this._name = name;
	}

	get fileName() {
		return this._fileName;
	}

	get data() {
		return this._data;
	}

	open() {
		windowEvents.dispatchEvent('selectItem', this);
	}

	select() {
		var selected = document.querySelector('.FileCurrent');
		if (selected) {
			selected.classList.remove('FileCurrent');
		}
		//if root choose header else choose element
		var element = this._element.header || this._element;
		element.classList.add('FileCurrent');
	}

	handleEvent(e) {
		super.handleEvent(e);
		switch (e.type) {
			case "click": this.onClick(e);
		}
	}

	reloadMenu(e) {
		if (specialKeys.hasFileMenu(path.basename(this._fileName))) {
			this._usesDefault = false;
			this._menu = Menu.buildFromTemplate(specialKeys.getFileMenu(path.basename(this._fileName)));
		} else {
			//Only rebuild the default menu if needed (the menu was special before).
			if (!this._usesDefault) {
				this._menu = Menu.buildFromTemplate(specialKeys.getDefaultFileMenu());
			}
			this._usesDefault = true;
		}
	}
}

module.exports = FileNode;
