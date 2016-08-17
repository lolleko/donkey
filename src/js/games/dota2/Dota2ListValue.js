const ListValue = require('../keyvalue/ListValue');
const fileManager = require('../../fileManager');

//TODO update cache if new stuff is added????
//Cache the autocomplete lists by filename so we dont have to generate them for every instance.
var cache = {};

class Dota2ListValue extends ListValue {
	constructor(value, parent, options) {
		super(value, parent, options);
		var file = this._options.file;
		if (!cache[file]) {
			cache[file] = this.getValuesFromFile(file);
		}
		this._autocomplete._list = cache[file];
	}

	getValuesFromFile(file) {
		var results = [];

		var fileContent = fileManager.getContent(file);


		if (fileContent) {
			var data = fileContent.values().next().value;

			for (var [key, value] of data.entries()) {
				results.push(key);
			}
		}
		return results;
	}
}

module.exports = Dota2ListValue;
