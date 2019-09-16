const { app, BrowserWindow } = require('electron');

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        icon: './favicon.png',
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadFile('index.html');
}

app.on('ready', createWindow);