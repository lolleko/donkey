const FileLeaf = require('./FileLeaf');
const path = require('path');
const specialKeys = require('./specialKeys');
const fileManager = require('./fileManager');
const FileNode = require('./FileNode');
const remote = require('electron').remote;
const dialog = remote.dialog;

class FileRoot extends FileNode{
	constructor(name, fileName, data, parent, parentContainer) {
		super(name, fileName, data, parent);

		this._children = [];
		this._icon = specialKeys.getIconForFile(this._fileName);
		this.createElement(parentContainer);

		this._isRoot = true;
		this._isParent = true;
	}

	getUniqueName(name) {
		var i = 0;
		var suffix = '';
		while (this._data.has(name + suffix)) {
			i++;
			suffix = i;
		}
		return name + suffix;
	}

	add(object) {
		this.addChild(object);
		this.addChildNode(object);
	}

	addChildNode(object) {
		this._element.inner.appendChild(object.element);
	}

	addChild(object) {
		this._children.push(object);
		if (!this._data.has(object.name) && (typeof this._data.get(object.name) != 'string')) {
			this._data.set(object.name, object.data);
		}
	}

	insertTop(object) {
		this._element.inner.insertBefore(object.element, this._element.inner.firstChild);
		this._children.unshift(object);

		this.unshiftData(object.name, object.data);

		// Set new parent
		object.parent = this;
	}

	insertDrop(object) {
		this.insertTop(object);
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
		this._data.delete(removedChild.name);
		return removedChild;
	}

	removeSelf() {

		var warning;

		if (fileManager.getModified(this._fileName)) {
			warning = dialog.showMessageBox(remote.getCurrentWindow(), {
				type : 'warning',
				buttons : ['Save & Close', 'Close', 'Cancel'],
				defaultId : 0,
				cancelId : 2,
				title : 'Warning!',
				message : 'Warning unsaved changes!',
				detail : 'Closing this file will destroy your changes, are you sure you want to proceed?'
			});
		} else {
			warning = -1;
		}

		//if no warning was created or warnign was ignored
		if (warning == -1 || warning == 1) {
			this._element.parentNode.removeChild(this._element);
			fileManager.closeFile(this._fileName);
		}
		//save & close
		else if (warning === 0) {
			fileManager.writeFile(this._fileName);
			this._element.parentNode.removeChild(this._element);
			fileManager.closeFile(this._fileName);
		}
		//cancel
		else if (warning == 2) {
			//TODO nothing?
		}

	}

	reload() {
		var oldInner = this._element.inner;
		this._element.replaceChild(this.createInner(), oldInner);
		this._element.inner.classList.add('FileRootInnerExpanded');
		this._element.superRoot.innerHTML = this._name;
		if (this._element.expander) {
			this._element.expander.classList.remove('octicon-chevron-right');
			this._element.expander.classList.add('octicon-chevron-down');
		}
	}

	createElement(parentContainer) {
		var container = document.createElement('div');
		container.classList.add('FileRootContainer');

		var header = document.createElement('div');
		header.classList.add('FileRootHeader');
		var icon = document.createElement('span');
		icon.classList.add('FileRootIcon');
		icon.classList.add('octicon');
		icon.classList.add(this._icon);
		header.appendChild(icon);

		var headerInner = document.createElement('div');
		headerInner.classList.add('FileRootHeaderInner');
		var fileName = document.createElement('span');
		fileName.classList.add('FileRootName');
		fileName.innerHTML = path.basename(this._fileName);
		var superRootName = document.createElement('span');
		superRootName.classList.add('FileRootNameSmall');
		superRootName.innerHTML = this._name;

		this._element = container;
		this._element.fileName = fileName;
		this._element.superRoot = superRootName;
		this._element.icon = icon;
		this._element.header = header;
		this._element.header.inner = headerInner;

		headerInner.appendChild(fileName);

		headerInner.appendChild(superRootName);

		header.appendChild(headerInner);

		container.appendChild(header);

		var inner = this.createInner();
		container.appendChild(inner);

		//insert alphabetically into the parent
		var inserted = false;
		for (var i = 0; i < parentContainer.children.length; i++) {
			var child = parentContainer.children[i];

			var name = child.querySelector('.FileRootName').innerText;

			if (name.localeCompare(path.basename(this._fileName)) >= 0) {
				parentContainer.insertBefore(container, child);
				i = parentContainer.children.length;
				inserted = true;
			}
		}

		//if list is empty or container is alphabetically the last
		if (!inserted) {
			parentContainer.appendChild(container);
		}

		header.addEventListener("click", this, false);
		header.addEventListener('dragover', this, false);
		header.addEventListener('dragenter', this, false);
		header.addEventListener('dragleave', this, false);
		header.addEventListener('drop', this, false);
		header.addEventListener("contextmenu", this, false);

		var close = document.createElement('span');
		close.classList.add('FileRootClose');
		close.classList.add('octicon');
		close.classList.add('octicon-x');
		header.appendChild(close);
		this._element.close = close;
	}

	createInner() {
		var inner = document.createElement('div');
		this._element.inner = inner;
		inner.classList.add('FileRootInner');

		for (var [key, value] of this._data.entries()) {
			if (typeof value != "string") {
				this.add(new FileLeaf(key, this._fileName, value, this));
			}
		}

		if (this._children.length !== 0) {
			var oldExpander = this._element.header.querySelector('.FileRootExpander');
			if (oldExpander) {
				oldExpander.parentNode.removeChild(oldExpander);
			}
			var expander = document.createElement('span');
			expander.classList.add('FileRootExpander');
			expander.classList.add('octicon');
			expander.classList.add('octicon-chevron-right');
			this._element.header.insertBefore(expander, this._element.icon);
			this._element.expander = expander;

			this._element.icon.classList.remove('FileRootIconNoExpander');
		} else {
			this._element.icon.classList.add('FileRootIconNoExpander');
		}

		return inner;
	}

	collapse() {
		var expander = this._element.expander;
		if (expander) {
			var fileInner = this._element.inner;
			fileInner.classList.remove('FileRootInnerExpanded');
			expander.classList.remove('octicon-chevron-down');
			expander.classList.add('octicon-chevron-right');
		}
	}

	expand() {
		var expander = this._element.expander;
		if (expander) {
			var fileInner = this._element.inner;
			fileInner.classList.add('FileRootInnerExpanded');
			expander.classList.remove('octicon-chevron-right');
			expander.classList.add('octicon-chevron-down');
		}
	}

	search(searchString) {
		if (searchString === ''){
			this.collapse();
			this._element.removeAttribute('hidden');
			var current = false;
			for (var i = 0; i < this._children.length; i++) {
				var child = this._children[i];
				child.element.removeAttribute('hidden');
				if (child.element.classList.contains('FileCurrent')) {
					current = true;
				}
			}

			if (current) {
				this.expand();
			}
		} else {
			this.expand();

			var oneFound = false;
			for (var j = 0; j < this._children.length; j++) {
				var child = this._children[j];
				child.element.setAttribute("hidden", true);
				if (child.name.includes(searchString)) {
					child.element.removeAttribute('hidden');
					oneFound = true;
				}
			}

			if (!oneFound && !path.basename(this._fileName).includes(searchString)) {
				this._element.setAttribute("hidden", true);
			} else {
				this._element.removeAttribute('hidden');
			}
		}
	}

	onClick(e) {
		//check if target is the expander
		var expander = this._element.expander;
		if (expander && e.target == expander) {
			var fileInner = this._element.inner;
			if (fileInner.classList.contains('FileRootInnerExpanded')) {
				this.collapse();
			} else {
				this.expand();
			}
			//check if target is filename
		} else if (e.target == this._element.close) {
			this.removeSelf();
		} else if (e.target.parentNode == this._element.header.inner || e.target == this._element.header || e.target.parentNode == this._element.header) {
			var file = fileManager.getFile(this._fileName);
			var warning = -1;
			if (file.stats.size > 250000) {
				warning = dialog.showMessageBox(remote.getCurrentWindow(), {
					type : 'warning',
					buttons : ['Cancel', 'Open'],
					defaultId : 0,
					cancelId : 0,
					title : 'Warning!',
					message : 'Warning opening large file!',
					detail : 'This file is larger than 250kb, loading it can cause lags and unexpected behaviour.\nUse the sub entries if possible!'
				});
			}
			//warning ignored or no warning fired
			if (warning == 1 || warning == -1) {
				this.open();
				this.select();
			}
		}
	}
}

module.exports = FileRoot;
