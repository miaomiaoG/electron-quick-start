const {app, BrowserWindow} = require('electron');

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      devTools: true,
      nodeIntegration: true,
    }
  });
  mainWindow.webContents.openDevTools();
  mainWindow.loadFile('index.html');
  /*const secondWindow = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
    },
    parent: mainWindow,
  });
  secondWindow.loadFile('second.html');*/
});
