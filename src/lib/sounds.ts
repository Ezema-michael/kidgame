class SoundPlayer {
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private initialized = false;

  constructor() {
    // Initialize empty Audio objects
    this.sounds = {
      trace: new Audio(),
      success: new Audio(),
      error: new Audio(),
      celebration: new Audio(),
    };
  }

  initialize() {
    if (this.initialized) return;

    const soundUrls = {
      trace:
        "https://assets.mixkit.co/active_storage/sfx/2073/2073-preview.mp3",
      success:
        "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3",
      error:
        "https://assets.mixkit.co/active_storage/sfx/2053/2053-preview.mp3",
      celebration:
        "https://assets.mixkit.co/active_storage/sfx/1434/1434-preview.mp3",
    };

    // Set sources and load sounds
    Object.entries(soundUrls).forEach(([name, url]) => {
      const sound = this.sounds[name as keyof typeof this.sounds];
      sound.src = url;
      sound.load();
    });

    this.initialized = true;
  }

  play(soundName: "trace" | "success" | "error" | "celebration") {
    if (!this.initialized) {
      this.initialize();
    }

    const sound = this.sounds[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound.volume = 0.3; // Set volume to 30%
      sound.play().catch((e) => {
        console.log("Sound play failed", e);
        // If play fails, try to initialize and play again
        this.initialize();
        sound.play().catch((e) => {
          console.log("Sound play failed again", e);
        });
      });
    }
  }
}

export const soundPlayer = new SoundPlayer();
