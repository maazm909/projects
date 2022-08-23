const {app, BrowserWindow} = require('electron');
const { dirname } = require('path');
const path = require('path');
const url = require('url');

let win;

function createWindow() {
  const win = new BrowserWindow({
    width:800, 
    height:600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

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

//run create createWindow
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
