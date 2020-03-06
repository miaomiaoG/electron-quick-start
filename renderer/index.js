const {ipcRenderer} = require('electron');
const {$} = require('./helper');
$('add-music-button').addEventListener('click', () => {
  ipcRenderer.send('add-music-button');
});
const renderListHTML = (tracks) => {
  const tracksList = $('tracksList');
  const tracksListHTML = tracks.reduce((html, track) => {
    html += `<li class="row music-track list-group-item d-flex justify-content-between align-items-center">
              <div class="col-10">
                <i class="fa fa-music mr-3 text-secondary"></i>
                <b>${track.fileName}</b>
              </div>
              <div class="col-2">
                <i class="fa fa-play mr-3 text-primary"></i>
                <i class="fa fa-trash-alt text-danger"></i>
              </div>
            </li>`;
    return html;
  }, '');
  const emptyTrackHTML = '<div class="alert alert-primary">尚未添加任何音乐</div>';
  tracksList.innerHTML = tracks.length ? `<ul class="list-group">${tracksListHTML}</ul>` : emptyTrackHTML;
};
ipcRenderer.on('getTracks', (event, tracks) => {
  renderListHTML(tracks);
});
