const { app, BrowserWindow } = require('electron');
const { ipcMain, screen } = require('electron');
const fs = require('fs');
const contextMenu = require('electron-context-menu');
const os = require('os');
const { autoUpdater } = require("electron-updater");
const { session } = require('electron')
const path = require('path');
const url = require("url");
const { shell } = require('electron')

/// HTTP SERVER ///
const runInHTTPServer = true;
const localPort = process.env['EPORT'] ? process.env['EPORT'] : 60536;
if(runInHTTPServer) {
  var contentTypesByExtension = {
    '.html': "text/html",
    '.css':  "text/css",
    '.js':   "text/javascript",
    '.png':  "image/png",
    '.jpg':  "image/jpg"
  };
  const http = require('http');
  server = http.createServer((request, response) => {

    const uri = url.parse(request.url).pathname;
    let filename = path.join(app.getAppPath(), 'www', uri);
    if(!fs.existsSync(filename)) {
      filename = path.join(app.getAppPath(), uri);
    }
    if(!fs.existsSync(filename)) {
      filename = path.join(__dirname, 'www', uri);
    }

    if(fs.existsSync(filename)) {
      if (fs.statSync(filename).isDirectory()) filename += '/index.html';

      fs.readFile(filename, "binary", function(err, file) {
        if(err) {
          response.writeHead(500, {"Content-Type": "text/plain"});
          response.write(err + "\n");
          response.end();
          return;
        }

        var headers = {};
        var contentType = contentTypesByExtension[path.extname(filename)];
        if (contentType) headers["Content-Type"] = contentType;
        response.writeHead(200, headers);
        response.write(file, "binary");
        response.end();
      });
    } else {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
    }
    if (request.url.includes('index.js'))
        server.close();
  }).listen(localPort);
}


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

contextMenu({ });

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
  if(runInHTTPServer) {
    win.loadURL('http://localhost:' + localPort + '/index.html');
  } else {
    win.loadFile('www/index.html');
  }

  win.on('focus', () => win.flashFrame(false));
  win.removeMenu();
  // open windows on webbrowser
  win.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    require('electron').shell.openExternal(url);
  });
  ipcMain.on('savelog', async (evt, data) => {
    let fname = data.target[0] == '#' ? ('channel-' + data.target.slice(1)) : ('privmsg-' + data.target);
    fname = fname.replace(/[^a-zA-Z0-9\s]/g, '-');
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
  ipcMain.on('ping', async(evt, data) => {
    if(!win.isFocused() || win.isMinimized() || !win.isVisible()) {
      win.flashFrame(true);
      evt.reply('playSound', {});
    }
  });
  ipcMain.on('blink', async(evt, data) => {
    if(!win.isFocused() || win.isMinimized() || !win.isVisible()) {
      win.flashFrame(true);
    }
  });
  ipcMain.on('openLogs', async(evt, data) => {
    shell.openPath(logsSave)
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
