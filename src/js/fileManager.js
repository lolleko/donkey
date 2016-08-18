const fs = require('fs');
const path = require('path');
const vdf = require('./vdf');
const windowEvents = require('./windowEvents');
const VDFFile = require('./VDFFile');

var openFiles = {};
var currentEdit;
var currentRoot;

exports.addFile = function(file) {
	fs.readFile(file, 'utf8', (err, data) => {
		var content = vdf.parse(data);
		if (content && content.size !== 0 && !openFiles[file] && typeof content.values().next().value != 'string') {
			var stats = fs.statSync(file);
			openFiles[file] = new VDFFile(file, content, stats);
		} else {
			//TODO handle error
		}
	});
};

exports.writeFile = function(file) {
	vdfFile.write();
};

exports.newFile = function(file, data) {
	var suffix = '';
	var i = 0;
	var tempFile = file;
	while(openFiles[file]) {
		i++;
		suffix = i;
		file = tempFile + suffix;
	}
	data = data || new Map([['ROOT', new Map()]]);
	var vdfFile = new VDFFile(file, data);
	openFiles[file] = vdfFile;
	vdfFile.write();
};

exports.fileToJSON = function(file) {
	return JSON.parse(fs.readFileSync(file, 'utf8'));
};

exports.closeFile = function(file) {
	openFiles[file].close();
	openFiles[file] = null;
	console.log(global);
};

exports.deleteFile = function(file) {
	var vdfFile = openFiles[file];
	vdfFile.delete();
	openFiles[file] = null;
};

exports.editFile = function(fileName) {
	if (currentEdit) {
		currentEdit.active = false;
	}
	currentEdit = openFiles[fileName];
	currentEdit.active = true;
};

exports.getCurrent = function() {
	return currentEdit;
};

exports.getFiles = function() {
	return openFiles;
};

exports.getFile = function(file) {
	if (openFiles[file]) {
		return openFiles[file];
	} else {
		for (var filePath in openFiles) {
			if (path.basename(filePath) == file) {
				return openFiles[filePath];
			}
		}
	}
};

exports.getContent = function(file) {
	if (exports.getFile(file)) {
		return exports.getFile(file).data;
	}
	return null;
};

exports.setModified = function(file, state) {
	openFiles[file].modified = state || true;
};

exports.getModified = function(file, state) {
	return openFiles[file].modified || false;
};

exports.openFile = function(directory) {
	var files = fs.readdirSync(directory);

	files.forEach(function(file) {
		exports.addFile(path.join(directory, file));
	});
};

exports.pathToArray = function(pathIn) {
	//platform-specific path segment separator
	var sep = path.sep;

	var pathArr = pathIn.split(sep);

	//remove empty string (POSIX)
	if (pathArr[0] === "") {
		pathArr.shift();
	}

	return pathArr;
};

exports.findSubDir = function(directory, subDir) {
	var result;

	if (path.basename(directory) == subDir) {
		return directory;
	}

	var pathArr = exports.pathToArray(subDir);

	function search(directory) {
		var files = fs.readdirSync(directory);

		files.forEach(function(file) {
			var absolutePath = path.join(directory, file);
			var stats = fs.statSync(absolutePath);
			if (stats.isDirectory()) {
				if (file == pathArr[0]) {
					pathArr.shift();
				}
				if (pathArr.length === 0 && !result) {
					result = absolutePath;
				} else {
					search(absolutePath);
				}
			}
		});
	}

	search(directory);
	return result;
};

exports.findFile = function(directory, name) {
	var result;

	function search(directory) {
		var files = fs.readdirSync(directory);

		files.forEach(function(file) {
			var absolutePath = path.join(directory, file);
			var stats = fs.statSync(absolutePath);
			if (stats.isDirectory()) {
				search(absolutePath);
			}
			if (stats.isFile() && file == name) {
				result = absolutePath;
			}
		});
	}

	search(directory);
	return result;
};

exports.getFileNameFromPath = function(file) {
	return path.basename(file);
};

exports.loadGames = function() {
	var games = fs.readdirSync(__dirname + '/games');
	games.forEach(function(game) {
		require('./games/' + game + '/init').initialize();
	});
};

exports.loadDataFromTemplate = function(file) {
	return vdf.parse(fs.readFileSync(file, 'utf8'));
};

exports.getCurrentRoot = function() {
	return currentRoot;
};

exports.setCurrentRoot = function(object) {
	currentRoot = object;
};
