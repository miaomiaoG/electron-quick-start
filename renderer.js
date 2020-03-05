const {ipcRenderer} = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.send('message', 'hello ipc from renderer');
  ipcRenderer.on('reply',(event,arg)=>{
    document.getElementById('message').innerHTML = arg
  })
});
