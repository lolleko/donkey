const BaseValue = require('./BaseValue');
const dialog = require('electron').remote.dialog;

class FileValue extends BaseValue {
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
		input.value = this._value;

		input.addEventListener('input', this, false);

		var openButton = document.createElement('span');
		openButton.classList.add('ValueInputButton');
		openButton.classList.add('octicon');
		openButton.classList.add('octicon-file-directory');

		openButton.addEventListener('click', this, false);

		container.appendChild(input);
		this.textInput = input;

		container.appendChild(openButton);

		this._element = container;
	}

	handleEvent(e) {
		switch (e.type) {
			case 'input': this.onInput(e); break;
			case 'click' : this.onClick(e); break;
		}
	}

	onInput(e) {
		this.changeValue(this._element.value);
	}

	onClick(e) {
		//temp variable for remote execution.
		var temp = this;
		dialog.showOpenDialog({
			title: 'Select File',
			properties: ['openFile']
		},
			function(files) {
				if (!files) {
					//no file selected -> bail
					return;
				}
				temp.changeValue(files[0]);
			}
		);
	}

}
module.exports = FileValue;
