const specialKeys = require('./specialKeys');
const AutocompleteInput = require('./AutocompleteInput');

class Key {
	constructor(key, parent) {
		this._key = key;
		this._parent = parent;
		this.createElement();
	}

	get element() {
		return this._element;
	}

	get key() {
		return this._key;
	}

	set key(newKey) {
		this._key = newKey;
		this._element.value = newKey;
	}

	changeKey(newKey) {
		this._parent.changeKey(this._key, newKey);
		this._key = newKey;
	}

	createElement() {
		var element;
		if (specialKeys.hasKeySuggestions()) {
			var values = specialKeys.getKeySuggestions();
			this._autocomplete = new AutocompleteInput({
				values: values,
				minChars: 2
			});
			element = this._autocomplete.element;

			element.input.classList.add('KeyInput');
			element.input.addEventListener('input', this, false);
			element.input.value = this._key;
		}
		// Don't waste resources if we don't actually need autocompletion
		else {
			element = document.createElement('input');
			element.type = 'text';
			element.classList.add('KeyInput');
			element.addEventListener('input', this, false);
			element.value = this._key;
		}

		this._element = element;
	}

	handleEvent(e) {
		switch (e.type) {
			case 'input': this.onInput(e); break;
		}
	}

	onInput(e) {
		this.changeKey(e.target.value);
	}

}

module.exports = Key;
