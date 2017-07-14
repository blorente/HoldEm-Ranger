const {ipcRenderer} = require('electron')
const {dialog} = require('electron').remote
const fs = require('fs')

let mousedown = 0;
function tableClick(elem) {
  let color = elem.style.background;
  if (mousedown === 1) {
    color = ipcRenderer.sendSync('synchronous-message', {type: 'select', hand: elem.id});
  }
  elem.style.background = color;
  return false;
}


function openFolder() {
  dialog.showOpenDialog({
      title:"Select a folder",
      properties: ["openDirectory"]
  }, (folderPaths) => {
      // folderPaths is an array that contains all the selected paths
      if(folderPaths === undefined){
          console.log("No destination folder selected");
          return;
      }else{
          console.log(folderPaths);
          fs.readdir(folderPaths[0], function (err, list) {
            // For every file in the list
            list.forEach(function (file) {
              // Full path of that file
              let path = folderPaths + "/" + file;
              // Get the file's stats
              fs.stat(path, function (err, stat) {
                console.log(stat);
                // If the file is a directory
                if (stat && stat.isDirectory())
                  // Dive into the directory
                  dive(path, action);
                else
                  // Call the action
                  addRecent(path);
              });
            });
          });
      }
  });
}

function clearRanges() {
  ipcRenderer.sendSync('synchronous-message', {type: 'clear'});
  return true;
}

function save() {
  ipcRenderer.sendSync('synchronous-message', {type: 'save'});
  return true;
}

function load() {
  ipcRenderer.sendSync('synchronous-message', {type: 'load-open'});
  return true;
}

ipcRenderer.on('refresh-table', (event, arg) => {
  refreshTable(arg.range);
  return;
})

ipcRenderer.on('load', (event, arg) => {
  console.log('Load range');
  refreshTable(arg.range);
  if (!arg.recent) {addRecent(arg.file)};
});

let refreshTable = function (range) {
  for (let col = 0; col < range.hands[0].length; col++) {
    for (let row = 0; row < range.hands[0].length; row++) {
      let elem = document.getElementById(col + '-' + row);
      elem.style.background = range.colors[range.hands[col][row]];
    }
  }
}

let recentTemplate = `<li class="list-group-item">
  <div  id=(id) class="media-body" onclick="loadRecent(this)">
    <strong>(title)</strong>
  </div>
</li>`

let addRecent = function (path) {
  let list = document.getElementById('recent-ranges');
  let fileTitle = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));
  let template = recentTemplate.replace('(title)', fileTitle);
  template = template.replace('(id)', path);
  list.innerHTML += template;
}

let loadRecent = (elem) => {
  ipcRenderer.sendSync('synchronous-message', {type: 'load-recent', path: elem.id});
}
