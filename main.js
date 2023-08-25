const { app, BrowserWindow} = require('electron')
const path = require('path')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        maxWidth: 1920,
        maxHeight: 1080,
        icon: path.join(__dirname, 'app/icons/favicon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
  
    win.loadFile('app/main.html')
  }

  app.whenReady().then(() => {
    createWindow()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

  // Définir l'icône de l'application pour Windows
  app.setAppUserModelId('com.example.myapp');

  // Définir l'icône de l'application pour macOS
  app.whenReady().then(() => {
    if (process.platform === 'darwin') {
      app.dock.setIcon(path.join(__dirname, 'icon.icns'));
    }
  });