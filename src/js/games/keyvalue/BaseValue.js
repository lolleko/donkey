const fileManager = require('../../fileManager');

//This isnt a functional class
//abstract
class BaseValue {
	constructor(value, parent, options) {
		this._value = value;
		this._parent = parent;
		this._options = options || {};
	}

	createElement() {
		//IMPLEMENT ME
	}

	get element() {
		return this._element;
	}

	get parent() {
		return this._parent;
	}

	get value() {
		return this._value;
	}

	get options() {
		return this._options;
	}

	changeValue(newValue) {
		this._parent.changeValue(this._value, newValue)
		this._value = newValue;
	}

	handleEvent(e) {
		//IMTEPLEMENT ME
	}

	onReload() {
		//Implement ME
	}

}

module.exports = BaseValue;
