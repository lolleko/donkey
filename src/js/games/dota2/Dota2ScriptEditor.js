const BaseValue = require('../keyvalue/BaseValue');
const fs = require('fs');

class Dota2ScriptEditor extends BaseValue {
	constructor(value, parent, options) {
		super(value, parent);
		this._options = options;
		this.createElement();
	}

	createElement() {

		var container = document.createElement('div');
		container.classList.add('ValueContainer');
		container.classList.add('ValueFileContainer');

		var input = document.createElement('input');
		input.classList.add('ValueInput');
		input.classList.add('ValueInputFile');
		input.type = 'text';
		input.value = this.value;

		input.addEventListener('input', this, false);

		var editButton = document.createElement('span');
		editButton.classList.add('ValueInputButton');
		editButton.classList.add('octicon');
		editButton.classList.add('octicon-pencil');

		editButton.addEventListener('click', this, false);

		container.appendChild(input);
		this.textInput = input;

		container.appendChild(editButton);

		this._element = container;
	}

	handleEvent(e) {
		switch (e.type) {
			case 'input':
				this.onInput(e);
				break;
			case 'click':
				this.onClick(e);
				break;
		}
	}

	onInput(e) {
		this.changeValue(this._element.value);
	}

	onClick(e) {
		var siblings = this._parent.parent.children;
		//access next ParentKey
		var filePath;
		for (var i = 0; i < siblings.length; i++) {
			var sibling = siblings[i];
			if (!sibling.isParent && sibling.key == 'ScriptFile') {
				filePath = sibling.valueObj.absolutePath;
			}
		}

		var openCmd;
		switch (process.platform) {
			case 'darwin':
				openCmd = 'open';
				break;
			case 'win32':
				openCmd = 'start';
				break;
			case 'win64':
				openCmd = 'start';
				break;
			default:
				openCmd = 'xdg-open';
				break;
		}

		var exec = require('child_process').exec;

		exec(openCmd + ' ' + filePath);
	}
}

module.exports = Dota2ScriptEditor;
