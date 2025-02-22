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
        "https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/sounds/pencil-trace.mp3",
      success:
        "https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/sounds/success.mp3",
      error:
        "https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/sounds/error.mp3",
      celebration:
        "https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/sounds/celebration.mp3",
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
      sound.volume = 0.5; // Set volume to 50%
      sound.play().catch(() => {
        // If play fails, try to initialize and play again
        this.initialize();
        sound.play().catch(() => {});
      });
    }
  }
}

export const soundPlayer = new SoundPlayer();
