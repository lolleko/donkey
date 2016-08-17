const BaseValue = require('./BaseValue');

class CheckBoxValue extends BaseValue {
	constructor(value, parent, options) {
		super(value, parent);
		this._options = options;
		this.createElement();

		if (this._value == this._options.off) {
			this._element.checkbox.checked = false;
		} else {
			this._element.checkbox.checked = true;
			if (this._value != this._options.on) {
				this.changeValue(this._options.on);
			}
		}
	}

	createElement() {
		var container = document.createElement('div');
		container.classList.add('ValueContainer');
		container.classList.add('ValueCheckBoxContainer');

		var checkbox = document.createElement('input');
		checkbox.classList.add('ValueInput');
		checkbox.classList.add('ValueInputCheckBox');
		checkbox.type = 'checkbox';

		checkbox.addEventListener('change', this, false);

		var label = document.createElement('label');

		var labelText = document.createElement('span');
		labelText.classList.add('ValueCheckBoxLabel');
		labelText.innerHTML = this._value;

		label.appendChild(checkbox);
		label.appendChild(labelText);
		container.appendChild(label);

		container.checkbox = checkbox;
		container.checkBoxLabel = label;
		container.checkBoxLabel.labelText = labelText;

		this._element = container;
	}

	handleEvent(e) {
		switch (e.type) {
			case 'change': this.onChange(e); break;
		}
	}

	onChange(e) {
		if (this._element.checkbox.checked) {
			this.changeValue(this._options.on);
			this._element.checkBoxLabel.labelText.innerHTML = this._options.on;
		} else {
			this.changeValue(this._options.off);
			this._element.checkBoxLabel.labelText.innerHTML = this._options.off;
		}
	}

}
module.exports = CheckBoxValue;
