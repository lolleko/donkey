const ListValue = require('../keyvalue/ListValue');
const fileManager = require('../../fileManager');

class Dota2Value extends ListValue {
	constructor(value, parent) {
		super(value, parent);
		this.createElement();
	}

	createElement() {
		super.createElement();
		this._element.input.addEventListener('focus', this, false);
	}

	getAutocompletionList() {
		var abilityData = fileManager.getCurrentRoot().data;
		var result = [];
		if (abilityData.has('AbilitySpecial')) {
			for (var [key, value] of abilityData.get('AbilitySpecial')) {
				for (var [key2, value2] of value) {
					if (key2 != 'var_type') {
						result.push('%' + key2);
					}
				}
			}
		}

		return result;
	}

	handleEvent(e) {
		switch (e.type) {
			case 'focus': this.onFocus(e); break;
		}
	}

	onFocus(e) {
		this._autocomplete.list = this.getAutocompletionList();
	}

	onInput(e) {
		if (this._element.input.value == '%') {
			this._autocomplete.list = this.getAutocompletionList();
		}
		super.onInput(e);
	}

}
module.exports = Dota2Value;
