const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const ranges = require('./ranges.js')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  win = new BrowserWindow({width: 630, height: 450})

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  win.setMenu(null)

  win.on('closed', () => {
    win = null
  })
}
app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

ipcMain.on('synchronous-message', (event, arg) => {
  if (arg.type === undefined) {
    return false;
  } else if (arg.type === 'select') {
    event.returnValue = ranges.selectHand(arg.hand);
  } else if (arg.type === 'save') {
    ranges.saveRange();
    event.returnValue = true;
  } else if (arg.type === 'load-open') {
    ranges.loadOpen(doneLoading);
    event.returnValue = true;
  } else if (arg.type === 'load-recent') {
    ranges.loadRecent(arg.path, doneLoading);
    event.returnValue = true;
  }
  return true;
})

let doneLoading = function (path, range, recent) {
  console.log("Done loading");
  win.webContents.send('load', {range: range, file: path, recent: recent});
};
