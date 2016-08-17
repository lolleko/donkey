const dragManager = require('./dragManager');
const specialKeys = require('./specialKeys');
const dialog = require('electron').remote.dialog;
const Menu = require('electron').remote.Menu;
const fileManager = require('./fileManager');

class Pair {
	constructor() {
		this._dragCounter = 0;
		this._isParent = false;
		this._isRoot = false;
		this._usesDefault = false;
		this._isContent = false;
		this._isNav = false;

		document.addEventListener('keyup', this, false);
		document.addEventListener('keydown', this, false);
	}

	handleEvent(e) {
		switch (e.type) {
			case 'dragstart' : this.onDragStart(e); break;
			case 'dragend' : this.onDragEnd(e); break;
			case 'dragover': this.onDragOver(e); break;
			case 'dragenter' : this.onDragEnter(e); break;
			case 'dragleave' : this.onDragLeave(e); break;
			case 'drop' : this.onDrop(e); break;
			case 'contextmenu' : this.onContextMenu(e); break;
			case 'keydown': this.onKeyDown(e); break;
			case 'keyup': this.onKeyUp(e); break;
		}
	}

	get isParent() {
		return this._isParent;
	}

	get isRoot() {
		return this._isRoot;
	}

	get isContent() {
		return this._isContent;
	}

	get isNav() {
		return this._isNav;
	}

	get parent() {
		return this._parent;
	}

	set parent(parent) {
		this._parent = parent;
	}

	get element() {
		return this._element;
	}

	set element(element) {
		this._element = element;
	}

	insertDrop(element) {
		// IMPLEMENT ME
	}

	unshiftData(newKey, newValue) {
		var tempMap = new Map(this.data);
		this.data.set(newKey, newValue);
		for (var [key, value] of tempMap.entries()) {
			this.data.delete(key);
			this.data.set(key, value);
		}
	}

	insertDataAt(newKey, newValue, keyAt) {
		var tempMap = new Map(this.data);
		for (var [key, value] of tempMap.entries()) {
			this.data.delete(key);
			this.data.set(key, value);
			if (keyAt == key) {
				this.data.set(newKey, newValue);
			}
		}
	}

	onDragStart(e) {
		if (this._isRoot) {
			e.preventDefault();
			return;
		}
		e.dataTransfer.setDragImage(this._element, 0 ,0);
		dragManager.setCurrent(this);
	}

	onDragEnd(e) {
		var draggedObj = dragManager.getCurrent();
		draggedObj.element.style.display = '';
	}

	onDragOver(e) {
		var draggedObj = dragManager.getCurrent();
		draggedObj.element.style.display = 'none';
		if (this.isContextSame(draggedObj)) {
			e.preventDefault();
		}
	}

	onDragEnter(e) {
		var draggedObj = dragManager.getCurrent();
		if (this.isContextSame(draggedObj)) {
			this._dragCounter++;
			e.currentTarget.classList.add('DragTarget');
		}
	}

	onDragLeave(e) {
		var draggedObj = dragManager.getCurrent();
		if (this.isContextSame(draggedObj)) {
			this._dragCounter--;
			if (this._dragCounter === 0) {
				e.currentTarget.classList.remove('DragTarget');
			}
		}
	}

	onDrop(e) {
		var draggedObj = dragManager.getCurrent();

		if (this.validLocation(draggedObj)) {
			var deletedPair = draggedObj.parent.remove(draggedObj);
			this.insertDrop(deletedPair);
		} else {
			dialog.showErrorBox("Error Moving KeyValue", "Can not move KeyValue, because the KeyValue contains the parent.");
		}

		e.currentTarget.classList.remove('DragTarget');

		this._dragCounter = 0;
	}

	onKeyDown(e) {
		if (e.altKey && this._element.drag && !this._dragVisible) {
			this._dragVisible = true;
			this._element.drag.classList.add('DisplayInlineBlock');
		}
	}

	onKeyUp(e) {
		if (this._element.drag && this._dragVisible) {
			this._dragVisible = false;
			this._element.drag.classList.remove('DisplayInlineBlock');
		}
	}

	onContextMenu(e) {
		//only build a menu if we need to
		if (!this._menu) {
			this.reloadMenu();
		}
		this.setMenuContext(this._menu);
		this._menu.popup();
	}

	setMenuContext(menu) {
		if (!menu) {
			return;
		}
		for (var i = 0; i < menu.items.length; i++) {
			menu.items[i]._pair = this;
			this.setMenuContext(menu.items[i].submenu);
		}
	}

	reloadMenu() {
		if (specialKeys.hasKeyMenu(this.key)) {
			this._usesDefault = false;
			this._menu = Menu.buildFromTemplate(specialKeys.getKeyMenu(this.key));
		} else {
			//Only rebuild the default menu if needed (the menu was special before).
			if (!this._usesDefault) {
				this._menu = Menu.buildFromTemplate(specialKeys.getDefaultKeyMenu());
			}
			this._usesDefault = true;
		}
	}

	fileChanged() {
		fileManager.getCurrent().modified = true;
	}

	//checks if object can be moved here (if object is parent of the location)
	//cant move parent into itself
	//TODO maybe remove rucursion!?
	validLocation(object) {
		if (object == this) {
			return false;
		}
		if (!this._isRoot) {
			return this._parent.validLocation(object);
		} else {
			return true;
		}
	}

	isContextSame(draggedObj) {
		if (this._isContent == draggedObj.isNav || this._isNav == draggedObj.isContent) {
			return false;
		}

		return true;
	}

}

module.exports = Pair;
