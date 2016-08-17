const fileManager = require('../../fileManager');
const FileValue = require('../keyvalue/FileValue');
const path = require('path');
const remote = require('electron').remote;
const dialog = remote.dialog;


class Dota2FileValue extends FileValue {

	constructor(value, parent, options) {
		super(value, parent, options);
		this._defaultDir = this.findDir(fileManager.getCurrent().name);
		this._absolutePath = this._defaultDir + path.sep + this._value;
	}

	get absolutePath() {
		return this._absolutePath;
	}

	onClick(e) {
		var dirPath = this.findDir(fileManager.getCurrent().name);
		if (!dirPath) {
			dialog.showMessageBox(remote.getCurrentWindow(), {
				type : 'warning',
				buttons : ['OK'],
				defaultId : 0,
				cancelId : 0,
				title : 'Warning!',
				message : 'Unable to locate directory!',
				detail : 'Could not find your Dota2 addon\'s "game" directory\nYour addon\'s structure seems to be modified/broken.\nTo use this feature make sure the file you are editing is inside your "addon/game" directory.'
			});
		} else {
			//temp variable for remote execution.
			var temp = this;
			dialog.showOpenDialog({
					title: 'Select File',
					defaultPath: dirPath,
					properties: ['openFile']
				},
				function(files) {
					if (!files) {
						//no file selected -> bail
						return;
					}
					var relativeFilePath = temp.getRelativePath(files[0]);
					temp.textInput.value = relativeFilePath;
					temp.changeValue(relativeFilePath);
					temp._absolutePath = temp._defaultDir + path.sep + temp._value;
				}
			);
		}
	}

	findDir(currentFile) {
		var pathArr = fileManager.pathToArray(currentFile);

		var gameDirIndex = -1;

		for (var i = 0; i < pathArr.length; i++) {
			if (pathArr[i] == 'game') {
				gameDirIndex = i;
			}
		}

		//Game dir not found => setup (folder structure) incorrect
		if (gameDirIndex == -1) {
			return false;
		}

		var customGameRoot = "";

		//append everything from root to game/dota_addons/addon_name/
		for (i = 0; i <= gameDirIndex + 2; i++) {
			customGameRoot += path.sep + pathArr[i];
		}

		//add last segments
		return fileManager.findSubDir(customGameRoot, this._options.defaultPath);
	}

	getRelativePath(absolutePath) {

		var resultArr;

		for (var i = 0; i < this._options.relativePaths.length; i++) {
			var pathArr = fileManager.pathToArray(absolutePath);
			var relPath = this._options.relativePaths[i];
			var optionsDirArr = fileManager.pathToArray(relPath.path);

			var arrInitialLen = pathArr.length;

			for (var j = 0; j < arrInitialLen; j++) {
				if (pathArr[0] == optionsDirArr[0]) {
					optionsDirArr.shift();
				}
				if (optionsDirArr.length !== 0) {
					pathArr.shift();
				} else {
					resultArr = pathArr;
				}
			}
			//shift one more
			pathArr.shift();

			if (relPath.prefix && resultArr) {
				resultArr[resultArr.length - 1] = relPath.prefix + resultArr[pathArr.length - 1];
			}

			if (resultArr) {
				break;
			}
		}

		if (!resultArr) {
			//TODO ERROR NO FILE FOUND (location invalid)
		}

		var relPath = '';

		for (var i = 0; i < resultArr.length; i++) {
			if (i === 0) {
				relPath += resultArr[i];
			} else {
				relPath += path.sep + resultArr[i];
			}
		}

		if (this._options.stripExtenstion) {
			var relPathInfo = path.parse(relPath);
			relPath = relPathInfo.dir + relPathInfo.name;
		}

		return relPath;
	}

}

module.exports = Dota2FileValue;
