const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 670,
    webPreferences: {
      nodeIntegration: false, // Prevents accidental `require` usage
      contextIsolation: true, // More secure
    },
  });

  win.loadFile("index.html"); // Load your game
}

app.whenReady().then(createWindow);
