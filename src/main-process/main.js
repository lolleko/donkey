const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const MenuTemplate = require('./MenuTemplate');

let win;

function createWindow() {
	win = new BrowserWindow({width: 1260, height: 800});

	win.loadURL(`file://${__dirname}/../index.html`);

	const menu = Menu.buildFromTemplate(MenuTemplate.getTemplate());
	Menu.setApplicationMenu(menu);

	win.on('closed', () => {
		win = null;
	});

}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (win === null) {
		createWindow();
	}
});
