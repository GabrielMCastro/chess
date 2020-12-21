const {app, BrowserWindow} = require('electron')  
const path = require('path')   

function createWindow () {   
    // Create the browser window.     
    const win = new BrowserWindow({width: 800, height: 600}) 
        
    // and load the index.html of the app.     
    win.loadURL(`file://${path.join(__dirname, '../build/index.html')}`)   
}      

app.whenReady().then(createWindow)

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})