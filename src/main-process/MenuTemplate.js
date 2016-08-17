const electron = require('electron');

const dialog = electron.dialog;
const app = electron.app;

const template = [{
	label: 'File',
	submenu: [{
		label: 'New File...',
		accelerator: 'CmdOrCtrl+N',
		click(menuItem, currentWindow) {
			dialog.showSaveDialog(currentWindow, {
				title: 'New File',
				buttonLabel: 'Create'
			}, function(fileName) {
				if (fileName) currentWindow.webContents.send('new-file', fileName);
			});
		}
	}, {
		label: 'Open File...',
		accelerator: 'CmdOrCtrl+O',
		click(menuItem, currentWindow) {
			dialog.showOpenDialog(currentWindow, {
				properties: ['openFile']
			}, function(files) {
				if (files) currentWindow.webContents.send('selected-file', files);
			});
		}
	}, {
		label: 'Open Folder...',
		accelerator: 'CmdOrCtrl+O+Shift',
		click(menuItem, currentWindow) {
			dialog.showOpenDialog(currentWindow, {
				properties: ['openDirectory']
			}, function(files) {
				if (files) currentWindow.webContents.send('selected-project', files);
			});
		}
	}, {
		label: 'Save',
		accelerator: 'CmdOrCtrl+S',
		click(menuItem, currentWindow) {
			currentWindow.webContents.send('save-file');
		}
	}]
}, {
	label: 'Edit',
	submenu: [{
		role: 'undo'
	}, {
		role: 'redo'
	}, {
		type: 'separator'
	}, {
		role: 'cut'
	}, {
		role: 'copy'
	}, {
		role: 'paste'
	}, {
		role: 'pasteandmatchstyle'
	}, {
		role: 'delete'
	}, {
		role: 'selectall'
	}, ]
}, {
	label: 'View',
	submenu: [{
		label: 'Reload',
		accelerator: 'CmdOrCtrl+R',
		click(item, focusedWindow) {
			if (focusedWindow) focusedWindow.reload();
		}
	}, {
		role: 'togglefullscreen'
	}, {
		label: 'Toggle Developer Tools',
		accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
		click(item, focusedWindow) {
			if (focusedWindow)
				focusedWindow.webContents.toggleDevTools();
		}
	}, ]
}, {
	label: 'Find',
	submenu: [{
		label: 'Find in File',
		accelerator: 'CmdOrCtrl+F',
		click(item, focusedWindow) {

		}
	}]
}, {
	role: 'window',
	submenu: [{
		label: 'Close',
		accelerator: 'CmdOrCtrl+W',
		role: 'close'
	}, {
		label: 'Minimize',
		accelerator: 'CmdOrCtrl+M',
		role: 'minimize'
	}, {
		label: 'Zoom',
		role: 'zoom'
	}, {
		type: 'separator'
	}, {
		label: 'Bring All to Front',
		role: 'front'
	}]
}, {
	role: 'help',
	submenu: [{
		label: 'Learn More',
		click() {
			require('electron').shell.openExternal('http://electron.atom.io');
		}
	}, ]
}, ];

if (process.platform === 'darwin') {
	const name = app.getName();
	template.unshift({
		label: name,
		submenu: [{
			role: 'about'
		}, {
			type: 'separator'
		}, {
			role: 'services',
			submenu: []
		}, {
			type: 'separator'
		}, {
			role: 'hide'
		}, {
			role: 'hideothers'
		}, {
			role: 'unhide'
		}, {
			type: 'separator'
		}, {
			role: 'quit'
		}, ]
	});
}

function getTemplate() {
	return template;
}

module.exports = {
	getTemplate: getTemplate
};
