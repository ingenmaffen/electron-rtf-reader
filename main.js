const { app, BrowserWindow, Menu, dialog } = require('electron');
const fs = require('fs');

const userPath = app.getPath('userData');

const mainMenu = Menu.buildFromTemplate([
    {
        label: 'File',
        submenu: [
            {
                label: 'Open',
                click: () => {
                    dialog.showOpenDialog(mainWindow, {
                        filters: 
                        {
                            name: 'Rich Text File',
                            extensions: ['rtf'] 
                        }
                        
                    }, filepath => {
                        mainWindow.webContents.send('path', filepath.toString());
                        fs.writeFile(userPath + '/filepath', filepath.toString(), () => {});
                    });
                }
            },
            {
                role: 'quit'
            }
        ]
    }
]);


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

    Menu.setApplicationMenu(mainMenu);

    mainWindow.webContents.on('did-finish-load', () => {
        fs.readFile(userPath + '/filepath', (err, data) => {
            mainWindow.webContents.send('path', data.toString());
        })
    });
   
}

app.on('ready', createWindow);