const KeyValue = require('./KeyValue');
const ContentNode = require('./ContentNode');
const fileManager = require('./fileManager');
const specialKeys = require('./specialKeys');
const AutocompleteInput = require('./AutocompleteInput');
const remote = require('electron').remote;
const dialog = remote.dialog;

class ParentKey extends ContentNode {
	constructor(key, data, parent, parentContainer) {
		super(key, value, parent);
		this._key = key;
		this._children = [];
		this._parent = parent;
		this._data = data || new Map();

		if (parentContainer) {
			this._isRoot = true;
			this.createElement();
			parentContainer.appendChild(this._element);
		} else {
			this.createElement();
		}

		for (var [key, value] of this._data) {
			if (typeof value == "string") {
				this.add(new KeyValue(key, value, this));
			} else {
				this.add(new ParentKey(key, value, this));
			}
		}

		this._isParent = true;
	}

	get key() {
		return this._key;
	}

	get data() {
		return this._data;
	}

	get value() {
		return this._data;
	}

	set data(data) {
		this._data = data;
	}

	get children() {
		return this._children;
	}

	get size() {
		return this._children.length;
	}

	changeKey(oldKey, newKey) {

		var tempMap = new Map(this.parent.data);
		var data = this._parent.data;
		//check if we are super root (first parent in file)
		if (this._isRoot && oldKey == this._parent.name) {
			if (this._parent.isRoot) {
				tempMap = new Map(fileManager.getCurrent().data);
				data = fileManager.getCurrent().data;
			} else {
				tempMap = new Map(this._parent.parent.data);
				data = this._parent.parent.data;
			}
		}

		if (data.has(newKey)) {
			var that = this;
			dialog.showMessageBox(remote.getCurrentWindow(), {
				type : 'warning',
				buttons : ['Okay'],
				defaultId : 0,
				cancelId : 0,
				title : 'Error!',
				message : 'Error a key with that name already exists!',
				detail : 'A key wiht this name already exists. Please choose a different name, or rename the key with that name.',
			},
			function(response) {
				//reset value (on the backend it never changed), but user still sees incorrect names.
				that._element.keyInput.value = oldKey;
			}
			);
			return;
		}

		//set new name
		this._parent.name = newKey;

		//set parent data to reflect changes
		for (var [key, value] of tempMap) {
			data.delete(key);
			if (key == oldKey) {
				data.set(newKey, value);
			} else {
				data.set(key, value);
			}
		}

		if (this._isRoot || this._parent.isRoot) {
			this._parent.reload();
		}

		this._key = newKey;
		this.reloadMenu();
		this.fileChanged();
	}

	removeChild(object) {
		var i = this._children.indexOf(object);
		return this._children.splice(i, 1)[0];
	}

	removeChildNode(object) {
		var i = this._children.indexOf(object);
		var child = this._children[i];

		return child.element.parentNode.removeChild(child.element);
	}

	remove(object) {
		var removedNode = this.removeChildNode(object);
		var removedChild = this.removeChild(object);
		removedChild.element = removedNode;
		this._data.delete(removedChild.key);
		return removedChild;
	}

	//bubble up reload event
	reload() {
		this._parent.reload();
	}

	addChild(object) {
		this._children.push(object);
		if (!this._data.has(object.key) && (typeof this._data.get(object.key) != 'string')) {
			this._data.set(object.key, object.data);
		}
	}

	addChildNode(object) {
		this._element.firstChild.nextSibling.appendChild(object.element);
	}

	add(object) {
		this.addChildNode(object);
		this.addChild(object);
	}

	getByIndex(index) {
		return this._children[index];
	}

	insertTop(object) {
		this._element.firstChild.nextSibling.insertBefore(object.element, this._element.firstChild.nextSibling.firstChild);
		this._children.unshift(object);

		this.unshiftData(object.key, object.value);

		// Set new parent
		object.parent = this;

		//Reload fileview
		if (this._isRoot || this._parent.isRoot) {
			this._parent.reload();
		}
	}

	insertDrop(object) {
		this.insertTop(object);
	}

	createElement() {
		var container = document.createElement('div');
		container.classList.add('ParentKeyContainer');

		var header = document.createElement('div');
		header.classList.add('ParentKeyLabel');

		if (!this._isRoot) {
			var drag = document.createElement('span');
			drag.classList.add('ParentKeyDrag');
			drag.classList.add('octicon');
			drag.classList.add('octicon-unfold');

			drag.draggable = true;

			drag.addEventListener('dragstart', this, false);
			drag.addEventListener('dragend', this, false);

			header.appendChild(drag);

			container.drag = drag;
		}

		var keyInput;
		if (specialKeys.hasParentKeySuggestions()) {
			var values = specialKeys.getParentKeySuggestions();
			this._autocomplete = new AutocompleteInput({
				values: values,
				minChars: 2
			});
			keyInput = this._autocomplete.element;
			keyInput.input.value = this._key;
			keyInput.input.classList.add('KeyInput');
			keyInput.input.classList.add('ParentKeyInput');
			keyInput.input.addEventListener('input', this, false);
		}
		// Don't waste resources if we don't actually need autocompletion
		else {
			keyInput = document.createElement('input');
			keyInput.type = 'text';
			keyInput.value = this._key;
			keyInput.classList.add('KeyInput');
			keyInput.classList.add('ParentKeyInput');
			keyInput.addEventListener('input', this, false);
		}

		header.appendChild(keyInput);

		container.appendChild(header);

		var inner = document.createElement('div');
		inner.classList.add('ParentKeyInner');
		container.appendChild(inner);

		header.addEventListener('dragover', this, false);
		header.addEventListener('dragenter', this, false);
		header.addEventListener('dragleave', this, false);
		header.addEventListener('drop', this, false);
		header.addEventListener('contextmenu', this, false);

		this._element = container;
		this._element.keyInput = keyInput;

	}

	handleEvent(e) {
		switch (e.type) {
			case 'input' : this.onInput(e); break;
		}
		super.handleEvent(e);
	}

	onInput(e) {
		this.changeKey(this._key, e.target.value);
	}
}

module.exports = ParentKey;
