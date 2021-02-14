const ipcRenderer = require('electron').ipcRenderer;

ipcRenderer.on('logRoute', function(evt, data) {
  const Nevt = new CustomEvent('logRoute', {detail: data});
  document.dispatchEvent(Nevt);
});

const electronApi = {
  log: function(data) {
    ipcRenderer.send('savelog', data);
  },
  getLogRoute: function(data) {
    ipcRenderer.send('getLogRoute', data);
  },
  setLogRoute: function(data) {
    ipcRenderer.send('setLogRoute', data);
  }
};