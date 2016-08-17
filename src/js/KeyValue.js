const Key = require('./Key');
const specialKeys = require('./specialKeys');
const ContentNode = require('./ContentNode');
const fileManager = require('./fileManager');
const remote = require('electron').remote;
const dialog = remote.dialog;

class KeyValue extends ContentNode {
	constructor(key, value, parent) {
		super(key, value, parent);

		this._keyObj = new Key(key, this);

		this._parent = parent;

		if (specialKeys.isKey(key)) {
			var ValueClass = specialKeys.getValueClassByKey(key);
			var options = specialKeys.getValueOptionsByKey(key);
			this._valueObj = new ValueClass(value, this, options);
		} else {
			var Value = specialKeys.getDefaultValueClass();
			this._valueObj = new Value(value, this);
		}

		this.createElement();
	}

	get keyObj() {
		return this._keyObj;
	}

	get valueObj() {
		return this._valueObj;
	}

	set key(key) {
		this._keyObj.key = key;
	}

	get key() {
		return this._keyObj.key;
	}

	set value(value) {
		this._valueObj.value = value;
	}

	get value() {
		return this._valueObj.value;
	}

	get data() {
		return this._parent.data;
	}

	changeKey(oldKey, newKey) {
		if (this.data.has(newKey)) {
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
				that._keyObj.key = oldKey;
			}
			);
			return;
		}


		var tempMap = new Map(this.data);

		for (var [key, value] of tempMap) {
			this.data.delete(key);
			if (key == oldKey) {
				this.data.set(newKey, value);
			} else {
				this.data.set(key, value);
			}
		}

		this.key = newKey;

		this.reloadValue();
		this.reloadMenu();
		this.fileChanged();
	}

	changeValue(oldValue, newValue) {
		this.data.set(this.key, newValue);
		this.fileChanged();
	}

	reloadValue() {
		var oldValue = this._valueObj;
		//replace value to mach key
		if (specialKeys.isKey(this.key)) {
			var ValueClass = specialKeys.getValueClassByKey(this.key);
			var options = specialKeys.getValueOptionsByKey(this.key);
			this._valueObj = new ValueClass(this.value, this, options);
		} else {
			var Value = specialKeys.getValueClassByName("Value");
			this._valueObj = new Value(this.value, this);
		}

		this.replaceChild(this._valueObj.element, oldValue.element);

		this._valueObj.onReload();
	}

	replaceChild(newChild, oldChild) {
		this._element.inner.replaceChild(newChild, oldChild);
	}

	insertTop(object) {
		this._element.parentNode.insertBefore(object.element, this._element.nextSibling);

		this.insertDataAt(object.key, object.value, this.key);
		// Set new parent
		this._parent.addChild(object);
		object.parent = this._parent;
	}

	insertDrop(object) {
		this.insertTop(object);
	}

	createElement() {
		var element = document.createElement('div');
		element.classList.add('KeyValue');

		var drag = document.createElement('span');
		drag.classList.add('KeyValueDrag');
		drag.classList.add('octicon');
		drag.classList.add('octicon-unfold');

		drag.draggable = true;

		drag.addEventListener('dragstart', this, false);
		drag.addEventListener('dragend', this, false);

		element.appendChild(drag);

		element.drag = drag;

		var inner = document.createElement('div');
		inner.classList.add('KeyValueInner');

		inner.appendChild(this._keyObj.element);

		inner.appendChild(this._valueObj.element);

		element.appendChild(inner);

		element.inner = inner;

		element.addEventListener('dragover', this, false);
		element.addEventListener('dragenter', this, false);
		element.addEventListener('dragleave', this, false);
		element.addEventListener('drop', this, false);
		element.addEventListener('contextmenu', this, false);

		this._element = element;
	}

}

module.exports = KeyValue;
