const { app, BrowserWindow,  Menu} = require('electron'); 
const isDev = require('electron-is-dev'); 
const path = require('path');
// const sqlite3 = require('sqlite3');   
let mainWindow;  
// eslint-disable-next-line no-unused-vars
const server = require('./server');

app.disableHardwareAcceleration(); 

// const db = new sqlite3.Database(
//   isDev
//     ? path.join(__dirname, '../db/salon.sqlite3') 
//     : path.join(process.resourcesPath, 'db/salon.sqlite3'),
//   (err) => {
//     if (err) {
    
//     } else {
     
//     }
//   }
// );

// Menu.setApplicationMenu(null);
// var splash;

const createWindow = () => {

//   splash = new BrowserWindow({width: 600, height: 300, alwaysOnTop: true, frame: false});
//   splash.loadURL(`file://${path.join(__dirname, '../build/splash.html')}`); 
//   splash.show()

  mainWindow = new BrowserWindow({
    width: 600,
    height: 600, 
    show: false, 
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {   
      nodeIntegration: true,
      enableRemoteModule: true, 
      contextIsolation: true,
    //   preload: isDev 
    //     ? path.join(__dirname, './preload.js')
    //     : path.join(app.getAppPath(), './build/preload.js'),
    },
  });  
  mainWindow.webContents.on('did-finish-load', function() {
    // console.log("public-did-finish-load")
    // splash.destroy();
    mainWindow.show();
  });  
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:9000' 
      : 'http://localhost:1818'
  ); 
  // mainWindow.setIcon(path.join(__dirname, '/icon.png'));
  mainWindow.maximize();
  // mainWindow.setSize(1024, 768);
  // mainWindow.setMenuBarVisibility(false);
  // mainWindow.setApplicationMenu(null);
    // mainWindow.removeMenu();
  // if (isDev) {
  //   mainWindow.webContents.on('did-frame-finish-load', () => {
  //     mainWindow.webContents.openDevTools();
  //   });
  // } 
  /**app quit */
  mainWindow.on('quit', function(e){
    // console.log("before-quit")
  }); 
  mainWindow.once('ready-to-show', () => {
    // console.log("public-ready-to-show")
    
  }); 

  mainWindow.on('close', function(e){
    // db.close();
    // console.log("Closed event");
  })

};  

app.setPath(
  'userData',
  isDev
    ? path.join(app.getAppPath(), 'userdata/') 
    : path.join(process.resourcesPath, 'userdata/')
);

app.on('quit', ()=>{
//   db.close();
  // window.localStorage.setItem("lastClosedOn", new Date().toISOString())
})

app.whenReady().then(async () => {
  createWindow(); 
});

// Exiting the app
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Activating the app
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Logging any exceptions
process.on('uncaughtException', (error) => {

  if (process.platform !== 'darwin') {
    app.quit();
  }
});  