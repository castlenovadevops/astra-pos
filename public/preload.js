process.once('loaded', () => {
    console.log("PRELOAD LOaded")
    const { contextBridge, ipcRenderer } = require('electron')
    
    contextBridge.exposeInMainWorld('api', {   
        on (eventName, callback) {
            ipcRenderer.on(eventName, callback)
          },
          async appOpen(args){
            return ipcRenderer.invoke('appOpen', args)
          },
          async closeWindow (args) {
            return  ipcRenderer.invoke("closeWindow", args)
          },
      async getPrinters (args) {
        return await ipcRenderer.invoke("getPrinters", args)
      },
      async printData (args) {
        return await ipcRenderer.invoke("printData", args)
      },
      async printHTML(args){
        console.log("ARGS", args)
        return await ipcRenderer.invoke("printHTML", args)
      }
    })
  })