const BaseValue = require('./BaseValue');
const AutocompleteInput = require('../../AutocompleteInput');

class ListValue extends BaseValue {
	constructor(value, parent, options) {
		super(value, parent, options);
		this.createElement();
	}

	createElement() {
		this._autocomplete = new AutocompleteInput(this._options);
		var element = this._autocomplete.element;
		var input = element.input;
		input.classList.add('ValueInput');
		input.value = this.value;
		input.addEventListener('input', this, false);

		this._element = element;
	}

	handleEvent(e) {
		switch (e.type) {
			case 'input': this.onInput(e); break;
		}
	}

	onInput(e) {
		this.changeValue(this._element.input.value);
	}
}

module.exports = ListValue;
