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
  ipcRenderer.sendSync('synchronous-message', {type: 'load-open'});
  return true;
}

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
    <p>(path)</p>
  </div>
</li>`

let addRecent = function (path) {
  let list = document.getElementById('recent-ranges');
  let fileTitle = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));
  let template = recentTemplate.replace('(title)', fileTitle);
  template = template.replace('(path)', path);
  template = template.replace('(id)', path)
  list.innerHTML += template;
}

let loadRecent = (elem) => {
  ipcRenderer.sendSync('synchronous-message', {type: 'load-recent', path: elem.id});
}
