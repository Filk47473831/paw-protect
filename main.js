const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
let mainWindow
const sound = require('sound-play')
const catSound = path.join(__dirname, "cat.mp3")

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 120,
    height: 160,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    },
    frame: false,
    transparent: true,
    resizable: false
  })

  mainWindow.loadFile('index.html')
  mainWindow.setAlwaysOnTop(true, 'screen');

  const { screen } = require('electron')
  const primaryDisplay = screen.getPrimaryDisplay()

  posX = primaryDisplay.workAreaSize.width - 200
  posY = primaryDisplay.workAreaSize.height - 200
  mainWindow.setPosition(posX, posY, true);
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
   if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('fullscreen', function () {
  console.log( '[message received]', 'Going fullscreen' );
  mainWindow.loadFile('fullscreen.html').then(function(){
    mainWindow.setFullScreen(true)
    sound.play(catSound)
  })
})

ipcMain.on('restore', function () {
  console.log( '[message received]', 'Restoring' );
  mainWindow.loadFile('index.html').then(function(){
    mainWindow.setFullScreen(false)
  })
})