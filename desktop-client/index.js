const { app, BrowserWindow } = require('electron');
const { ipcMain, screen } = require('electron');
const fs = require('fs');
const contextMenu = require('electron-context-menu');
const os = require('os');
const { autoUpdater } = require("electron-updater");

let hiraClientCFG;
if (os.platform() == 'linux') {
  hiraClientCFG = process.env['HOME'].toString() + '/.hiraclient2';
} else {
  hiraClientCFG = process.env['USERPROFILE'].toString() + '/.hiraclient2';
}

let HCCFG;
if(fs.existsSync(hiraClientCFG)) {
  HCCFG = JSON.parse(fs.readFileSync(hiraClientCFG));
}
if(!HCCFG) {
  HCCFG = {};
}

let logsSave;
if(HCCFG.logsSave) {
  logsSave = HCCFG.logsSave;
} else if (os.platform() == 'linux') {
  logsSave = process.env['HOME'].toString() + '/hiraclient2-logs';
} else {
  logsSave = process.env['USERPROFILE'].toString() + '/hiraclient2-logs';
}

contextMenu({
//   prepend: (params, browserWindow) => [
//       {
//         role: "zoomIn"
//       },
//       {
//         role: "zoomOut"
//       },
//   ],
});

function createWindow () {
  autoUpdater.checkForUpdatesAndNotify();

  if (!fs.existsSync(logsSave)){
    fs.mkdirSync(logsSave);
  }
  // Create the browser window.
  const win = new BrowserWindow({
    width: parseInt(95*screen.getPrimaryDisplay().size.width/100, 10), // 95% of screen
    height: parseInt(90*screen.getPrimaryDisplay().size.height/100, 10), // 90% of screen
    webPreferences: {
      nodeIntegration: true
    },
    icon: __dirname +  '/resources/256x256.png'
  });

  // and load the index.html of the app.
  win.loadFile('www/index.html');
  win.on('focus', () => win.flashFrame(false));
  win.removeMenu();
  // open windows on webbrowser
  win.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    require('electron').shell.openExternal(url);
  });
  ipcMain.on('savelog', async (evt, data) => {
    const fname = data.target[0] == '#' ? ('channel-' + data.target.slice(1)) : ('privmsg-' + data.target);
    const flocation = logsSave + '/log-'+fname+'.txt';
    fs.writeFile(flocation, data.message, { flag: "a+" }, (err) => {
      if (err) throw err;
    }); 
  });
  ipcMain.on('getLogRoute', async(evt, data) => {
    win.webContents.send('logRoute', logsSave)
  });
  ipcMain.on('setLogRoute', async(evt, data) => {
    let validRoute = true;
    if(!fs.existsSync(data)) {
      try {
        fs.mkdirSync(data);
      } catch(e) {
        validRoute = false;
      }
    }
    if (validRoute) {
      logsSave = data;
      HCCFG.logsSave = data;
      fs.writeFileSync(hiraClientCFG, JSON.stringify(HCCFG));
    }
  });
}

app.whenReady().then(createWindow);
// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') {
//       app.quit()
//     }
// });

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
});
