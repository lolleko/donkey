const windowEvents = require('./windowEvents');
const fileManager = require('./fileManager');
const vdf = require('./vdf');
const fs = require('fs');

class VDFFile {
	constructor(name, data, stats) {
		this._name = name;
		this._data = data;
		this._stats = stats;
		this._modified = false;
		this._active = false;

		//get first key (DOTAAbilites, DOTAHereos, ....)
		var superRoot, superRootName;
		for (var [key, value] of this._data.entries()) {
			superRoot = value;
			superRootName = key;
		}
		this._nav = document.querySelector('.NavInner');
		const FileRoot = require('./FileRoot');
		this._fileRoot = new FileRoot(superRootName, this._name, superRoot, this, this._nav);
	}

	get data() {
		return this._data;
	}

	get name() {
		return this._name;
	}

	get modified() {
		return this._modified;
	}

	set modified(modified) {
		this._modified = modified;
	}

	get stats() {
		return this._stats;
	}

	set stats(stats) {
		this._stats = stats;
	}

	get active() {
		return this._active;
	}

	set active(active) {
		this._active = active;
	}

	write() {
		var content = vdf.dump(this._data);
		var that = this;
		fs.writeFile(this._name, content, function(err) {
			if(err) {
				return console.log(err);
			}
			var stats = fs.statSync(that._name);
			that._stats = stats;
		});

		this._modified = false;
	}

	close() {
		if (this._active) {
			var content = document.querySelector('.content');
			content.innerHTML = "";
			fileManager.setCurrentRoot(null);
		}
		windowEvents.dispatchEvent('fileClosed', {target: this._name});
	}

	delete() {
		fs.unlink(file, (err) => {
			console.log('The ' + file + ' was deleted!');
		});
	}

	rename() {

	}

	search(searchString) {
		this._fileRoot.search(searchString);
	}


}

module.exports = VDFFile;
