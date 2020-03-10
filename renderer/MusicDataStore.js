const Store = require('electron-store');
const uuidv4 = require('uuid/v4');
const path = require('path');

class DataStore extends Store {
  constructor(settings) {
    super(settings);
    this.tracks = this.get('tracks') || [];
  }

  saveTracks() {
    this.set('tracks', this.tracks);
    return this;
  }

  getTracks() {
    return this.get('tracks') || [];
  }

  addTracks(tracks) {
    const trackWidthProps = tracks.map(track => {
      return {
        id: uuidv4(),
        path: track,
        fileName: path.basename(track),
      };
    }).filter(track => {
      const currentTracksPath = this.getTracks().map(track => track.path);
      return !currentTracksPath.includes(track.path);
    });
    this.tracks = [...this.tracks, ...trackWidthProps];
    return this.saveTracks();
  }

  deleteTrack(deleteId) {
    this.tracks = this.tracks.filter(item => item.id !== deleteId);
    return this.saveTracks();
  }

}

module.exports = DataStore;
