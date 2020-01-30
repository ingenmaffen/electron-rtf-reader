const { app, BrowserWindow, Menu, dialog, ipcMain } = require("electron");
const fs = require("fs");

const userPath = app.getPath("userData");

const mainMenu = Menu.buildFromTemplate([
  {
    label: "File",
    submenu: [
      {
        label: "Open",
        click: () => {
          dialog.showOpenDialog(
            mainWindow,
            {
              filters: {
                name: "Rich Text File",
                extensions: ["rtf"]
              }
            },
            filepath => {
              if (filepath && filepath.length) {
                mainWindow.webContents.send("path", filepath.toString());
                fs.writeFile(
                  userPath + "/filepath",
                  filepath.toString(),
                  () => {}
                );
              }
            }
          );
        }
      },
      {
        role: "quit"
      }
    ]
  },
  {
    label: "View",
    submenu: [
      {
        label: "Find",
        accelerator: "CmdOrCtrl+F",
        click: () => {
          searchWindow.show();
        }
      },
      {
        label: "Theme",
        submenu: [
          {
            label: "Light",
            click: () => {
              mainWindow.webContents.send("theme", "light");
            }
          },
          {
            label: "Dark",
            click: () => {
              mainWindow.webContents.send("theme", "dark");
            }
          }
        ]
      }
    ]
  }
]);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 800,
    minHeight: 600,
    icon: "./favicon.png",
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadFile("index.html");
  mainWindow.webContents.on("dom-ready", () => {
    mainWindow.webContents.send("load-theme", null);
  });
  mainWindow.webContents.on("did-finish-load", () => {
    fs.readFile(userPath + "/filepath", (err, data) => {
      if (data) mainWindow.webContents.send("path", data.toString());
    });
  });

  mainWindow.openDevTools();

  searchWindow = new BrowserWindow({
    width: 300,
    height: 100,
    parent: mainWindow,
    modal: true,
    show: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  searchWindow.loadFile("search.html");
  ipcMain.on("search", (_event, message) => {
    searchWindow.hide();
    mainWindow.webContents.send("search", message);
  });

  Menu.setApplicationMenu(mainMenu);
}

app.on("ready", createWindow);
