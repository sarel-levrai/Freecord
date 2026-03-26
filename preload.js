const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  close: () => ipcRenderer.send('window-control', 'close'),
  minimize: () => ipcRenderer.send('window-control', 'minimize')
})