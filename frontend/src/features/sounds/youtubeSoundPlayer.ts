import { loadYouTubeIFrameApi, type YTPlayer } from '../backgrounds/loadYouTubeIFrameApi';
import { parseYouTubeUrl } from '../backgrounds/youtubeUrl';

let currentPlayer: YTPlayer | null = null;
let currentContainer: HTMLDivElement | null = null;
let stopTimer: number | null = null;

/**
 * Plays audio from a YouTube URL using the IFrame API.
 * Creates a hidden player, plays for the specified duration, then cleans up.
 * 
 * @param url - YouTube URL to play
 * @param volume - Volume level (0-100)
 * @param durationMs - How long to play before auto-stopping (milliseconds)
 * @returns Promise<boolean> - true if playback started successfully, false otherwise
 */
export async function playYouTubeSound(
  url: string,
  volume: number = 50,
  durationMs: number = 2000
): Promise<boolean> {
  // Clean up any existing player first
  stopYouTubeSound();

  try {
    // Parse the YouTube URL
    const parseResult = parseYouTubeUrl(url);
    if ('error' in parseResult) {
      console.warn('Invalid YouTube URL:', parseResult.error);
      return false;
    }

    const { videoId } = parseResult;

    // Load the YouTube IFrame API
    await loadYouTubeIFrameApi();

    // Create a hidden container for the player
    currentContainer = document.createElement('div');
    currentContainer.style.position = 'fixed';
    currentContainer.style.top = '-9999px';
    currentContainer.style.left = '-9999px';
    currentContainer.style.width = '1px';
    currentContainer.style.height = '1px';
    currentContainer.style.pointerEvents = 'none';
    document.body.appendChild(currentContainer);

    // Create the player
    return new Promise<boolean>((resolve) => {
      currentPlayer = new window.YT.Player(currentContainer!, {
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: (event: any) => {
            try {
              event.target.setVolume(volume);
              event.target.playVideo();
              
              // Set up auto-stop timer
              stopTimer = window.setTimeout(() => {
                stopYouTubeSound();
              }, durationMs);
              
              resolve(true);
            } catch (error) {
              console.warn('Failed to start YouTube sound playback:', error);
              stopYouTubeSound();
              resolve(false);
            }
          },
          onError: () => {
            console.warn('YouTube player error');
            stopYouTubeSound();
            resolve(false);
          },
        },
      });
    });
  } catch (error) {
    console.warn('Failed to play YouTube sound:', error);
    stopYouTubeSound();
    return false;
  }
}

/**
 * Stops the currently playing YouTube sound and cleans up resources.
 */
export function stopYouTubeSound(): void {
  if (stopTimer !== null) {
    clearTimeout(stopTimer);
    stopTimer = null;
  }

  if (currentPlayer) {
    try {
      currentPlayer.stopVideo();
      currentPlayer.destroy();
    } catch (error) {
      // Ignore cleanup errors
    }
    currentPlayer = null;
  }

  if (currentContainer && currentContainer.parentNode) {
    currentContainer.parentNode.removeChild(currentContainer);
    currentContainer = null;
  }
}

/**
 * Checks if a URL is a YouTube URL.
 */
export function isYouTubeUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return (
      urlObj.hostname === 'www.youtube.com' ||
      urlObj.hostname === 'youtube.com' ||
      urlObj.hostname === 'm.youtube.com' ||
      urlObj.hostname === 'youtu.be'
    );
  } catch {
    return false;
  }
}
