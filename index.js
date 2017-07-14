const {ipcRenderer} = require('electron')

let mousedown = 0;
function tableClick(elem) {
  let color = elem.style.background;
  if (mousedown === 1) {
    color = ipcRenderer.sendSync('synchronous-message', {type: 'select', hand: elem.id});
  }
  elem.style.background = color;
  return false;
}

function save() {
  ipcRenderer.sendSync('synchronous-message', {type: 'save'});
  return true;
}

function load() {
  range = ipcRenderer.sendSync('synchronous-message', {type: 'load'});
  return true;
}

ipcRenderer.on('load', (event, arg) => {console.log('Load range');refreshTable(arg)})

let refreshTable = function (range) {
  for (let col = 0; col < range.hands[0].length; col++) {
    for (let row = 0; row < range.hands[0].length; row++) {
      let elem = document.getElementById(col + '-' + row);
      elem.style.background = range.colors[range.hands[col][row]];
    }
  }
}
