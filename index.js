const {ipcRenderer} = require('electron')
const {dialog} = require('electron').remote
const fs = require('fs')

let mousedown = 0;
function tableClick(elem) {
  let color = elem.style.background;
  if (mousedown === 1) {
    color = ipcRenderer.sendSync('synchronous-message', {type: 'select', hand: elem.id});
  } else {
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

function changeColor(color) {
  ipcRenderer.sendSync('synchronous-message', {type: 'change-color', color: color});
  let colors = document.getElementById('colors');
  let children = colors.childNodes;
  let btns = 0;
  for (let i = 0; i < children.length; i++) {
    console.log(children[i]);
    if (children[i].type == 'submit') {
      children[i].classList.remove('active')
      if (btns === color) {
        children[i].className += ' active';
        btns = children.length;
      }
      btns = btns + 1;
    }
  }
  return true;
}

ipcRenderer.on('refresh-table', (event, arg) => {
  refreshTable(arg.range);
  return;
})

ipcRenderer.on('load', (event, arg) => {
  refreshTable(arg.range);
  let fileTitle = arg.file.substring(arg.file.lastIndexOf('/') + 1, arg.file.lastIndexOf('.'));
  fileTitle = fileTitle.replace(/_/g, ' ')
  document.getElementById('range-title').innerHTML = fileTitle;
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

let recentTemplate = `<li class="list-group-item" id="(id)" onclick="loadRecent(this)">
  <div class="media-body">
    <strong>(title)</strong>
  </div>
</li>`

let addRecent = function (path) {
  let list = document.getElementById('recent-ranges');
  let fileTitle = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));
  fileTitle = fileTitle.replace(/_/g, ' ')
  let template = recentTemplate.replace('(title)', fileTitle);
  template = template.replace('(id)', path);
  list.innerHTML += template;
}

let loadRecent = (elem) => {
  ipcRenderer.sendSync('synchronous-message', {type: 'load-recent', path: elem.id});
}
