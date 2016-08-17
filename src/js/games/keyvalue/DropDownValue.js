const BaseValue = require('./BaseValue');

class DropDownValue extends BaseValue {
	constructor(value, parent, options) {
		super(value, parent);
		this._options = options;
		this.createElement();
	}

	createElement() {
		var element =  document.createElement("select");

		element.classList.add('ValueInput');
		element.classList.add('ValueInputDropDown');

		var valid = false;
		for (var i = 0; i < this._options.values.length; i++) {
			var value = this._options.values[i];
			var opt = new Option(value, value);
			if (value == this._value) {
				opt.selected = true;
				valid = true;
			}
			element.options.add(opt);
		}

		if (!valid) {
			var opt = new Option('INVALID_VALUE_CHANGE_ME', 'INVALID_VALUE_CHANGE_ME');
			opt.selected = true;
			element.options.add(opt);
			element.invalid = opt;
		}

		element.addEventListener('input', this, false);

		this._element = element;
	}

	handleEvent(e) {
		switch (e.type) {
			case 'input': this.onInput(e); break;
		}
	}

	onInput(e) {
		//If the invalid value was cleared remove the entry from the dropdown
		if (this._element.value != 'INVALID_VALUE_CHANGE_ME') {
			if (this._element.invalid) {
				this._element.remove(this._element.invalid.index);
			}
		}
		this.changeValue(this._element.value);
	}

}
module.exports = DropDownValue;
