const { app, BrowserWindow, Menu, dialog } = require('electron');

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
                        // TODO: give path to renderer and save cookies
                        mainWindow.webContents.send('path', filepath.toString())
                    })
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

    // mainWindow.webContents.openDevTools();
   
}

app.on('ready', createWindow);