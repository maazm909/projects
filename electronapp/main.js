const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

let win;

function createWindow() {
  win = new BrowserWindow({width:800, height:600});

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
    webPreferences: {
      nodeIntegration: true,
    }
  }));

  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}

//run create createWindow
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
