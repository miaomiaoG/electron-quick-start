const {ipcRenderer} = require('electron');
const {$, convertDuration} = require('./helper');

let musicAudio = new Audio(), allTracks, currentTrack;

$('add-music-button').addEventListener('click', () => {
  ipcRenderer.send('add-music-button');
});

$('tracksList').addEventListener('click', (event) => {
  event.preventDefault();
  const {dataset, classList} = event.target;
  const id = dataset && dataset.id;
  if (id && classList.contains('fa-play')) {
    // 播放音乐
    if (currentTrack && currentTrack.id === id) {
      //  继续播放
      musicAudio.play();
    } else {
      //  播放新歌曲，并还原图标
      currentTrack = allTracks.find(o => o.id === id);
      musicAudio.src = currentTrack.path;
      musicAudio.play();
      const resetIconElement = document.querySelector('.fa-pause');
      if (resetIconElement) {
        resetIconElement.classList.replace('fa-pause', 'fa-play');
      }
    }
    classList.replace('fa-play', 'fa-pause');
  } else if (id && classList.contains('fa-pause')) {
    //  暂停播放
    musicAudio.pause();
    classList.replace('fa-pause', 'fa-play');
  } else if (id && classList.contains('fa-trash-alt')) {
    //  删除音乐
    ipcRenderer.send('delete-track', id);
  }
});

const renderPlayerHTML = (name, duration) => {
  const player = $('player-status');
  const html = `<div class="col font-weight-bold">
                  正在播放：${name}
                </div>
                <div class="col">
                  <span id="current-seeker">00:00</span> / ${convertDuration(duration)}
                </div>`;
  player.innerHTML = html;
};

const updateProgressHTML = (currentTime, duration) => {
  const seeker = $('current-seeker');
  seeker.innerHTML = convertDuration(currentTime);
  const progressBar = $('progress-bar');
  const progress = `${Math.floor(currentTime / duration * 100)}%`;
  progressBar.style.width = progress;
  progressBar.innerHTML = progress;
};

const renderListHTML = (tracks) => {
  const tracksList = $('tracksList');
  const tracksListHTML = tracks.reduce((html, track) => {
    html += `<li class="row music-track list-group-item d-flex justify-content-between align-items-center">
              <div class="col-10">
                <i class="fa fa-music mr-3 text-secondary"></i>
                <b>${track.fileName}</b>
              </div>
              <div class="col-2">
                <i class="fa fa-play mr-3" data-id="${track.id}"></i>
                <i class="fa fa-trash-alt text-danger" data-id="${track.id}"></i>
              </div>
            </li>`;
    return html;
  }, '');
  const emptyTrackHTML = '<div class="alert alert-primary">尚未添加任何音乐</div>';
  tracksList.innerHTML = tracks.length ? `<ul class="list-group">${tracksListHTML}</ul>` : emptyTrackHTML;
};

musicAudio.addEventListener('loadedmetadata', () => {
  renderPlayerHTML(currentTrack.fileName, musicAudio.duration);
});

musicAudio.addEventListener('timeupdate', () => {
  updateProgressHTML(musicAudio.currentTime, musicAudio.duration);
});

$('progress').addEventListener('click', (event) => {
  if (currentTrack) {
    musicAudio.currentTime = event.offsetX / $('progress').clientWidth * musicAudio.duration;
    // musicAudio.play();
  }
});



ipcRenderer.on('getTracks', (event, tracks) => {
  allTracks = tracks;
  renderListHTML(tracks);
});
