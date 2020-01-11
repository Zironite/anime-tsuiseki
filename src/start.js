const electron = require('electron')
const app = electron.app
const shell = electron.shell;
const path = require('path')
const isDev = require('electron-is-dev')
const BrowserWindow = electron.BrowserWindow
const electronNodeUtil = require('./electron-node-util');

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`,
  );

  mainWindow.on("new-window", function(event, url) {
    event.preventDefault();
    shell.openExternal(url);
  });

  mainWindow.on('closed', () => {
    mainWindow = null
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
});

electron.ipcMain.on('asynchronous-message', (e,arg) => {
  e.tsuiseki_request_id = arg.request_id;
  switch (arg.type) {
    case 'queryAniList':
      electronNodeUtil.queryAniList(arg.url, arg.method, arg.headers, arg.body, e);
      break;
    case 'setProcessCommandsToMonitor':
      electronNodeUtil.setProcessCommandsToMonitor(arg.commands);
      break;
    case 'setAcceptedExtensions':
      electronNodeUtil.setAcceptedExtensions(arg.extensions);
      break;
    case 'setFileNameRegexes':
      electronNodeUtil.setFileNameRegexes(arg.fileNameRegexes);
      break;
    case 'setCurrentOpenAnime':
      electronNodeUtil.setCurrentOpenAnime(arg.name, arg.episode);
    default:
      break;
  }
});

setInterval(() => {
  electronNodeUtil.monitorProcesses(mainWindow.webContents);
}, 1000);
