const BaseValue = require('./BaseValue');

class Value extends BaseValue {
	constructor(value, parent) {
		super(value, parent);

		this.createElement();
	}

	createElement() {
		var element = document.createElement('input');
		element.classList.add('ValueInput');
		element.classList.add('ValueInputText');
		element.type = 'text';
		element.value = this._value;

		element.addEventListener('input', this, false);

		this._element = element;
	}

	handleEvent(e) {
		switch (e.type) {
			case 'input': this.onInput(e); break;
		}
	}

	onInput(e) {
		this.changeValue(this._element.value);
	}
}

module.exports = Value;
