const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let mainWindow;
let serverProcess;

app.whenReady().then(() => {
  // Start the Express server
  serverProcess = spawn('node', [path.join(__dirname, 'server.js')], {
    stdio: 'inherit', // Show server logs in the terminal
    shell: true, // Ensures it runs correctly on different OS
  });

  // Create the Electron window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
});
mainWindow.maximize(); // Maximizes the window

  // Load the local server into Electron
  mainWindow.loadURL('http://localhost:3000');

});

app.on('window-all-closed', () => {
  if (serverProcess) serverProcess.kill(); // Stop the server when Electron closes
  if (process.platform !== 'darwin') app.quit();
});
