import { useEffect, useRef, useState } from 'react';
import { loadYouTubeIFrameApi, YTPlayer } from './loadYouTubeIFrameApi';

interface YouTubeBackgroundPlayerProps {
  videoId: string;
  volume: number;
  onError?: (error: string | null) => void;
}

export function YouTubeBackgroundPlayer({ videoId, volume, onError }: YouTubeBackgroundPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasInteractionError, setHasInteractionError] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Calculate dimensions to cover viewport (object-cover equivalent)
  useEffect(() => {
    const updateDimensions = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const viewportRatio = viewportWidth / viewportHeight;
      const videoRatio = 16 / 9;

      let width: number;
      let height: number;

      if (viewportRatio > videoRatio) {
        // Viewport is wider than video - fit to width
        width = viewportWidth;
        height = viewportWidth / videoRatio;
      } else {
        // Viewport is taller than video - fit to height
        height = viewportHeight;
        width = viewportHeight * videoRatio;
      }

      setDimensions({ width: Math.ceil(width), height: Math.ceil(height) });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Initialize the YouTube player
  useEffect(() => {
    let mounted = true;
    let player: YTPlayer | null = null;

    const initPlayer = async () => {
      try {
        await loadYouTubeIFrameApi();

        if (!mounted || !containerRef.current) return;

        // Clear any existing player
        if (containerRef.current.firstChild) {
          containerRef.current.innerHTML = '';
        }

        // Create a unique ID for the player element
        const playerId = `youtube-player-${Date.now()}`;
        const playerElement = document.createElement('div');
        playerElement.id = playerId;
        containerRef.current.appendChild(playerElement);

        player = new window.YT.Player(playerId, {
          videoId,
          width: dimensions.width || window.innerWidth,
          height: dimensions.height || window.innerHeight,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            showinfo: 0,
            loop: 1,
            playlist: videoId, // Required for looping
            mute: 0, // Start unmuted so we can control volume
          },
          events: {
            onReady: (event: any) => {
              if (!mounted) return;
              
              playerRef.current = player;
              setIsReady(true);

              // Set initial volume
              try {
                event.target.setVolume(volume);
                event.target.playVideo();
              } catch (err) {
                // Browser may block autoplay with audio
                setHasInteractionError(true);
                onError?.('Your browser blocked audio. Click anywhere on the page to enable sound.');
              }
            },
            onError: (event: any) => {
              if (!mounted) return;
              
              const errorMessages: Record<number, string> = {
                2: 'Invalid YouTube video ID.',
                5: 'HTML5 player error. The video may not be available.',
                100: 'Video not found. It may have been removed or is private.',
                101: 'Video cannot be embedded. The owner has restricted playback.',
                150: 'Video cannot be embedded. The owner has restricted playback.',
              };
              
              const message = errorMessages[event.data] || 'YouTube video failed to load.';
              onError?.(message);
            },
            onStateChange: (event: any) => {
              // Handle any state changes if needed
              if (event.data === window.YT.PlayerState.ENDED) {
                // Video ended, it should loop automatically due to playlist param
              }
            },
          },
        });
      } catch (err) {
        if (mounted) {
          onError?.('Failed to load YouTube player. Please check your internet connection.');
        }
      }
    };

    initPlayer();

    return () => {
      mounted = false;
      if (player) {
        try {
          player.destroy();
        } catch (err) {
          // Ignore cleanup errors
        }
      }
      playerRef.current = null;
    };
  }, [videoId, onError, dimensions]);

  // Update volume when it changes
  useEffect(() => {
    if (isReady && playerRef.current) {
      try {
        if (volume === 0) {
          playerRef.current.mute();
        } else {
          if (playerRef.current.isMuted()) {
            playerRef.current.unMute();
          }
          playerRef.current.setVolume(volume);
        }
        
        // If we had an interaction error, try playing again
        if (hasInteractionError) {
          playerRef.current.playVideo();
          setHasInteractionError(false);
          onError?.(null);
        }
      } catch (err) {
        // Volume change might fail if user hasn't interacted yet
        if (!hasInteractionError) {
          setHasInteractionError(true);
          onError?.('Your browser blocked audio. Click anywhere on the page and adjust the volume to enable sound.');
        }
      }
    }
  }, [volume, isReady, hasInteractionError, onError]);

  // Add click handler to recover from autoplay restrictions
  useEffect(() => {
    if (!hasInteractionError) return;

    const handleClick = () => {
      if (playerRef.current) {
        try {
          playerRef.current.unMute();
          playerRef.current.setVolume(volume);
          playerRef.current.playVideo();
          setHasInteractionError(false);
          onError?.(null);
        } catch (err) {
          // Still blocked
        }
      }
    };

    document.addEventListener('click', handleClick, { once: true });
    return () => document.removeEventListener('click', handleClick);
  }, [hasInteractionError, volume, onError]);

  return (
    <div
      ref={containerRef}
      className="youtube-background-wrapper"
    />
  );
}
