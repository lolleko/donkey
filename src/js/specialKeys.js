const path = require('path');
const fileManager = require('./fileManager');

var currentGame;
var games = {};
var defaultGame;
var defaultKeyMenu;
var defaultFileMenu;
var valueClasses = {};

exports.registerValue = function(game, type, keyName, options) {
	games[game].values[keyName] = {};
	games[game].values[keyName].type = type;
	games[game].values[keyName].options = options;
};

exports.registerValueClass = function(name, valueClass) {
	valueClasses[name] = valueClass;
};

exports.getValueClassByKey = function(keyName) {
	return valueClasses[games[currentGame].values[keyName].type];
};

exports.getValueClassByName = function(name) {
	return valueClasses[name];
};

exports.getValueOptionsByKey = function(keyName) {
	return games[currentGame].values[keyName].options;
};

exports.getDefaultValueClass = function(file, game) {
	file = file || fileManager.getCurrent().name;
	file = path.basename(file);
	game = game || currentGame;
	if (games[game].commonFiles[file] && games[game].commonFiles[file].defaultValueClass) {
		return valueClasses[games[game].commonFiles[file].defaultValueClass];
	} else if (games[game].defaultValueClass) {
		return valueClasses[games[game].defaultValueClass];
	} else {
		return valueClasses[games[defaultGame].defaultValueClass];
	}
};

exports.isKey = function(keyName) {
	if (games[currentGame].values[keyName]) {
		return true;
	} else {
		return false;
	}
};

exports.registerKeyMenu = function(game, menuTemplate, keyName) {
	var menu = [];
	menu = menu.concat({type: 'separator'}, menuTemplate);
	games[game].keyMenus[keyName] = menu;
};

exports.registerDefaultKeyMenu = function(menuTemplate) {
	defaultKeyMenu = menuTemplate;
};

exports.getKeyMenu = function(keyName) {
	var menu = [];
	menu = menu.concat(defaultKeyMenu, games[currentGame].keyMenus[keyName]);
	return menu;
};

exports.getDefaultKeyMenu = function() {
	return defaultKeyMenu;
};

exports.hasKeyMenu = function(keyName) {
	if (games[currentGame].keyMenus[keyName]) {
		return true;
	} else {
		return false;
	}
};

exports.registerDefaultFileMenu = function(menuTemplate) {
	defaultFileMenu = menuTemplate;
};

exports.getFileMenu = function(file) {
	var menu = [];
	for (var game in games) {
		if (games[game].commonFiles[file]) {
			menu = menu.concat(defaultFileMenu, {type: 'separator'}, games[game].commonFiles[file].menu);
			return menu;
		}
	}
	return menu;
};

exports.getDefaultFileMenu = function() {
	return defaultFileMenu;
};

exports.hasFileMenu = function(file) {
	var menu = [];
	for (var game in games) {
		if (games[game].commonFiles[file]) {
			if (games[game].commonFiles[file].menu) {
				return true;
			}
		}
	}

	return false;
};

exports.getKeySuggestions = function(file, game) {
	file = file || fileManager.getCurrent().name;
	file = path.basename(file);
	return games[game || currentGame].commonFiles[file].keySuggestions;
};

exports.hasKeySuggestions = function(file, game) {
	file = file || fileManager.getCurrent().name;
	file = path.basename(file);
	if (games[game || currentGame].commonFiles && games[game || currentGame].commonFiles[file]) {
		if (games[game || currentGame].commonFiles[file].keySuggestions) {
			return true;
		} else {
			return false;
		}
	}
};

exports.getParentKeySuggestions = function(file, game) {
	file = file || fileManager.getCurrent().name;
	file = path.basename(file);
	return games[game || currentGame].commonFiles[file].parentKeySuggestions;
};

exports.hasParentKeySuggestions = function(file, game) {
	file = file || fileManager.getCurrent().name;
	file = path.basename(file);
	if (games[game || currentGame].commonFiles && games[game || currentGame].commonFiles[file]) {
		if (games[game || currentGame].commonFiles[file].parentKeySuggestions) {
			return true;
		} else {
			return false;
		}
	}
};

exports.registerGame = function(game, options) {
	games[game] = options;
	games[game].values = {};
	games[game].keyMenus = {};
};

exports.getCurrentGame = function() {
	return currentGame;
};

exports.getGames = function() {
	return games;
};

exports.setCurrentGame = function(game) {
	if (!games[game]) {
		return false;
	}
	currentGame = game;
	return true;
};

exports.setDefaultGame = function(game) {
	defaultGame = game;
};

exports.getDefaultGame = function() {
	return defaultGame;
};

exports.getIconForFile = function(file) {
	file = path.basename(file);
	var found = false;
	for (var game in games) {
		if (games[game].commonFiles[file]) {
			return games[game].commonFiles[file].icon;
		}
	}
	return 'octicon-file';
};

exports.setGameForFile = function(file) {
	file = path.basename(file);
	var found = false;
	for (var game in games) {
		if (games[game].commonFiles) {
			if(games[game].commonFiles[file]){
				found = true;
				currentGame = game;
			}
		}
	}
	if (!found) {
		currentGame = this.getDefaultGame();
	}
};
