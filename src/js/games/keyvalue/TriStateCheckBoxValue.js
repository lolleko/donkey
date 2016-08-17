const BaseValue = require('./BaseValue');

class TriStateCheckBoxValue extends BaseValue {
	constructor(value, parent, options) {
		super(value, parent, options);
		this.createElement();

		var checkbox = this._element.checkbox;
		if (this._value == this._options.off) {
			this.checked = 0;
			checkbox.checked = false;
		} else if (this._value == this._options.indeterminate) {
			this.checked = 1;
			checkbox.checked = false;
			checkbox.indeterminate = true;
			checkbox.classList.add('CheckBoxIndeterminate');
		} else {
			this.checked = 2;
			checkbox.checked = true;
			if (this._value != this._options.on) {
				this.changeValue(this._options.on);
			}
		}
	}

	createElement() {
		var container = document.createElement('div');
		container.classList.add('ValueContainer');

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
		container.checkboxLabel = label;
		container.checkboxLabel.labelText = labelText;

		this._element = container;
	}

	handleEvent(e) {
		switch (e.type) {
			case 'change': this.onChange(e); break;
		}
	}

	onChange(e) {
		var checkbox = this._element.checkbox;

		//handle styling (checked state)
		if (this.checked === 0) {
			this.checked++;
			checkbox.indeterminate = true;
			checkbox.classList.add('CheckBoxIndeterminate');
			checkbox.checked = false;
		} else if (this.checked == 1) {
			this.checked++;
			checkbox.classList.remove('CheckBoxIndeterminate');
			checkbox.indeterminate = false;
			checkbox.checked = true;
		} else if (this.checked == 2) {
			this.checked = 0;
			checkbox.checked = false;
		}

		//handle backend value change
		//after this.checked has been changed
		if (this.checked === 0) {
			this.changeValue(this._options.off);
			this._element.checkboxLabel.labelText.innerHTML = this._options.off;
		} else if (this.checked == 1){
			this.changeValue(this._options.indeterminate);
			this._element.checkboxLabel.labelText.innerHTML = this._options.indeterminate;
		} else if (this.checked == 2) {
			this.changeValue(this._options.on);
			this._element.checkboxLabel.labelText.innerHTML = this._options.on;
		}
	}

}
module.exports = TriStateCheckBoxValue;
