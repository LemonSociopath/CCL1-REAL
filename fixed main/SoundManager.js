class SoundManager {
    constructor() {
      this.currentTrack = null;
    }
  
    play(trackSrc, loop = true) {
      // Stop the currently playing track
      this.stop();
  
      // Create a new audio element for the new track
      this.currentTrack = new Audio(trackSrc);
      this.currentTrack.loop = loop;
      this.currentTrack.volume = 0.5; // Adjust volume as needed
      this.currentTrack.play();
    }
  
    stop() {
      if (this.currentTrack) {
        this.currentTrack.pause();
        this.currentTrack = null;
      }
    }
  
    setVolume(volume) {
      if (this.currentTrack) {
        this.currentTrack.volume = volume;
      }
    }
  }
  
  window.soundManager = new SoundManager();
  