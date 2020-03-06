const {app, BrowserWindow, ipcMain, dialog} = require('electron');

class AppWindow extends BrowserWindow {
  constructor(config, fileLocation) {
    const baseConfig = {
      width: 1000,
      height: 600,
      webPreferences: {
        devTools: true,
        nodeIntegration: true,
      },
    };
    const finalConfig = {...baseConfig, ...config};
    super(finalConfig);
    this.loadFile(fileLocation);
    this.once('ready-to-show', () => {
      this.show();
    });
  }
}

app.on('ready', () => {
  const mainWindow = new AppWindow({}, './renderer/index.html');
  mainWindow.webContents.openDevTools();
  ipcMain.on('add-music-button', (event, arg) => {
    const addWindow = new AppWindow({
      width: 400,
      height: 500,
      parent: mainWindow,
    }, './renderer/add.html');
  });
  ipcMain.on('open-music-file', ((event, arg) => {
    dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{name: 'Music', extensions: ['mp3']}],
    }, files => {
      console.log(files);
    });
  }));
});
