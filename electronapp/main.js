/* eslint-disable require-jsdoc */
const {app, BrowserWindow} = require('electron');
// const { dirname } = require('path');
const path = require('path');
// const url = require('url');
require('@electron/remote/main').initialize();
if (require('electron-squirrel-startup')) app.quit();

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInSubFrames: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
    },
  });
  require('@electron/remote/main').enable(win.webContents);


  win.loadFile(path.join(__dirname, 'index.html'));

  // win.loadURL(url.format({
  //   pathname: path.join(__dirname, 'index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }));

  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}

// run create createWindow
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
