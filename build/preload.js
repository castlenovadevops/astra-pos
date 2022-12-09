process.once('loaded', () => {
    console.log("PRELOAD LOaded")
    const { contextBridge, ipcRenderer } = require('electron')
    
    contextBridge.exposeInMainWorld('api', {   
        on (eventName, callback) {
            ipcRenderer.on(eventName, callback)
          },
      async getPrinters (args) {
        return await ipcRenderer.invoke("getPrinters", args)
      }
    })
  })