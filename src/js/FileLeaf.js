const FileNode = require('./FileNode');

class FileLeaf extends FileNode{
	constructor(name, fileName, data, parent) {
		super(name, fileName, data, parent);
		this.createElement();
	}

	getUniqueName(name) {
		return this._parent.getUniqueName(name);
	}

	createElement() {
		var container = document.createElement('div');
		container.classList.add('FileLeaf');
		container.innerHTML = this._name;
		container.draggable = true;

		this._element = container;
		this._element.addEventListener("click", this, false);
		this._element.addEventListener('dragend', this, false);
		this._element.addEventListener('dragstart', this, false);
		this._element.addEventListener('dragover', this, false);
		this._element.addEventListener('dragenter', this, false);
		this._element.addEventListener('dragleave', this, false);
		this._element.addEventListener('drop', this, false);
		this._element.addEventListener("contextmenu", this, false);
	}

	insertTop(object) {
		this._element.parentNode.insertBefore(object.element, this._element.nextSibling);

		this._parent.insertDataAt(object.name, object.data, this._name);
		// Set new parent
		this._parent.addChild(object);
		object.parent = this._parent;
	}

	insertDrop(object) {
		this.insertTop(object);
	}

	reload() {
		this._parent.reload();
	}

	onClick() {
		this.open();
		var selected = document.querySelector('.FileCurrent');
		this.select();
	}
}

module.exports = FileLeaf;
