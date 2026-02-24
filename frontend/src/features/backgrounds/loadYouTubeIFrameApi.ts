/**
 * Loads the YouTube IFrame Player API script and returns a promise
 * that resolves when the API is ready to use.
 * 
 * This function ensures the script is only loaded once, even if called
 * multiple times concurrently.
 */

let apiLoadPromise: Promise<void> | null = null;

export function loadYouTubeIFrameApi(): Promise<void> {
  // If already loading or loaded, return the existing promise
  if (apiLoadPromise) {
    return apiLoadPromise;
  }

  // Check if the API is already loaded
  if (window.YT && window.YT.Player) {
    return Promise.resolve();
  }

  apiLoadPromise = new Promise((resolve, reject) => {
    // Set up the callback that YouTube API will call when ready
    (window as any).onYouTubeIframeAPIReady = () => {
      resolve();
    };

    // Create and inject the script tag
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    script.onerror = () => {
      apiLoadPromise = null;
      reject(new Error('Failed to load YouTube IFrame API'));
    };

    document.head.appendChild(script);
  });

  return apiLoadPromise;
}

// TypeScript declarations for YouTube IFrame API
declare global {
  interface Window {
    YT: {
      Player: new (elementId: string | HTMLElement, config: any) => YTPlayer;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  stopVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  setVolume(volume: number): void;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  getVolume(): number;
  destroy(): void;
  getPlayerState(): number;
}
