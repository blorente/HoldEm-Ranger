const {dialog, ipcMain} = require('electron');
const app = require('./app.js');
const fs = require('fs'); // Load the File System to execute our common tasks (CRUD)

let currentRange = {
  hands: emptyHands(),
  colors: ['white', 'cyan']
}
let selectedColor = 1;

module.exports.loadRange = function(callback) {
  // Open file
  let loaded = false;
  let res = false;
  dialog.showOpenDialog((fileNames) => {
    // fileNames is an array that contains all the selected
    if(fileNames === undefined){
        console.log("No file selected");
        res = false;
        return;
    }

    fs.readFile(fileNames[0], 'utf-8', (err, data) => {
        if(err){
            console.error("An error ocurred reading the file :" + err.message);
            res = false;
            return;
        }

        currentRange = JSON.parse(data);
        callback(currentRange);
        return;
    });
    return;
  });
};

module.exports.saveRange = function() {
  const content = JSON.stringify(currentRange);
  let res = false;
  dialog.showSaveDialog((fileName) => {
      if (fileName === undefined){
          console.log("You didn't save the file");
          res = false;
          return;
      }
      fileName += '.rng'
      // fileName is a string that contains the path and filename created in the save file dialog.
      fs.writeFile(fileName, content, (err) => {
          if(err){
              console.error("An error ocurred creating the file "+ err.message)
              res = false;
              return;
          }
          console.log("The file has been succesfully saved");
          res = true;
          return;
      });
  });
  return res;
};

module.exports.selectHand = function(tableid) {
  let col = Number(tableid.substring(0, tableid.search('-')));
  let row = Number(tableid.substring(tableid.search('-') + 1));
  console.log(`Selected hand (${col}, ${row})`);
  currentRange.hands[col][row] = selectedColor;
  return currentRange.colors[selectedColor];
};

function emptyHands() {
  hands = new Array(13);
  for (let i = 0; i < 13; i++) {
    hands[i] = new Array(13).fill(0);
  }
  console.log(hands);
  return hands;
}
