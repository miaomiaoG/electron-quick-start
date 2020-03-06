const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const DataStore = require('./renderer/MusicDataStore');
const myStore = new DataStore({'name': 'Music Data'});

class AppWindow extends BrowserWindow {
  constructor(config, fileLocation) {
    const baseConfig = {
      width: 1100,
      height: 800,
      webPreferences: {
        devTools: true,
        nodeIntegration: true,
      },
    };
    const finalConfig = {...baseConfig, ...config};
    super(finalConfig);
    this.loadFile(fileLocation);
    this.webContents.openDevTools();
    this.once('ready-to-show', () => {
      this.show();
    });
  }
}

app.on('ready', () => {
  const mainWindow = new AppWindow({}, './renderer/index.html');
  ipcMain.on('add-music-button', (event, arg) => {
    const addWindow = new AppWindow({
      width: 800,
      height: 600,
      parent: mainWindow,
    }, './renderer/add.html');
  });

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('page did finish load');
    mainWindow.send('getTracks', myStore.getTracks());
  });

  ipcMain.on('add-tracks', (event, tracks) => {
    const updatedTracks = myStore.addTracks(tracks).getTracks();
    mainWindow.send('getTracks', updatedTracks);
  });

  ipcMain.on('open-music-file', (event, arg) => {
    dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{name: 'Music', extensions: ['mp3']}],
    }).then(result => {
      if (!result.canceled) {
        event.sender.send('selected-file', result.filePaths);
      }
    });
  });
});
