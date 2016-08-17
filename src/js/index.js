const electron = require('electron');
const ipc = electron.ipcRenderer;
const fileManager = require('./fileManager');
const FileRoot = require('./FileRoot');
const ParentKey = require('./ParentKey');
const specialKeys = require('./specialKeys');
const windowEvents = require('./windowEvents');
const dragManager = require('./dragManager');

fileManager.loadGames();

windowEvents.on('documentReady', function() {
	var games = Object.keys(specialKeys.getGames());
	var footerGame = document.querySelector('.footer-game');
	for (var i = 0; i < games.length; i++) {
		var opt = new Option(games[i], games[i]);
		if (games[i] == specialKeys.getDefaultGame()) {
			opt.selected = true;
		}
		footerGame.options.add(opt);
	}

	footerGame.addEventListener('input', function(e) {
		specialKeys.setCurrentGame(this.value);
		windowEvents.dispatchEvent('gameChange', {
			game: this.value
		});
	}, false);

	var searchInput = document.querySelector('.FileSearchInput');
	searchInput.addEventListener('input', function(e) {
		var files = fileManager.getFiles();
		for (var fileName in files) {
			files[fileName].search(this.value);
		}
	});
});

windowEvents.on('selectItem', function(e) {

	//donte reload if already active
	if (fileManager.getCurrentRoot() && e && e.name == fileManager.getCurrentRoot().name) {
		return;
	}

	var content = document.querySelector('.content');

	//clear content
	content.innerHTML = "";

	//if no new item was supplied jsut end here (content has been cleared)
	if(!e) {
		return;
	}

	specialKeys.setGameForFile(e.fileName);
	fileManager.editFile(e.fileName);

	//load new keys
	fileManager.setCurrentRoot(new ParentKey(e.name, e.data, e, content));

	//update footer
	var footerFile = document.querySelector('.footer-file');
	footerFile.innerHTML = fileManager.getCurrent().name;

	var footerGame = document.querySelector('.footer-game');
	for (var i = 0; i < footerGame.options.length; i++) {
		if (footerGame.options[i].text == specialKeys.getCurrentGame()) {
			footerGame.options[i].selected = true;
		}
	}

	e.select();
});

windowEvents.on('reloadTree', function(e) {
	var nav = document.querySelector('.NavInner');

	nav.innerHTML = "";

	var openFiles = fileManager.getFiles();

	for (var file in openFiles) {
		new FileRoot(file, file, fileManager.getContent(file), null, nav);
	}
});

windowEvents.on('gameChange', function(e) {
	var currentRoot = fileManager.getCurrentRoot();

	var content = document.querySelector('.content');

	//clear content
	content.innerHTML = "";

	//reload
	if (currentRoot) {
		fileManager.setCurrentRoot(new ParentKey(currentRoot.key, currentRoot.data, null, content));
	}
});

windowEvents.on('fileClosed', function(e) {

});

ipc.on('selected-project', function(event, directories) {
	var directory = directories[0];

	fileManager.openFile(directory);
});

ipc.on('selected-file', function(event, files) {
	var file = files[0];

	fileManager.addFile(file);
});

ipc.on('new-file', function(event, fileName) {
	fileManager.newFile(fileName);
});

ipc.on('save-file', function(event) {
	if (fileManager.getCurrent()) {
		fileManager.getCurrent().write();
	}
});
