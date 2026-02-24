import { useEffect, useRef, useState, memo } from 'react';
import { loadYouTubeIFrameApi, YTPlayer } from './loadYouTubeIFrameApi';

interface YouTubeBackgroundPlayerProps {
  videoId: string;
  volume: number;
  isPlaying?: boolean;
  onError?: (error: string | null) => void;
}

export const YouTubeBackgroundPlayer = memo(function YouTubeBackgroundPlayer({ videoId, volume, isPlaying = true, onError }: YouTubeBackgroundPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasInteractionError, setHasInteractionError] = useState(false);

  const onErrorRef = useRef(onError);
  useEffect(() => {
    onErrorRef.current = onError;
  });

  const volumeRef = useRef(volume);
  useEffect(() => {
    volumeRef.current = volume;
  });

  const isPlayingRef = useRef(isPlaying);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  });

  const dimensionsRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const viewportRatio = viewportWidth / viewportHeight;
      const videoRatio = 16 / 9;

      let width: number;
      let height: number;

      if (viewportRatio > videoRatio) {
        width = viewportWidth;
        height = viewportWidth / videoRatio;
      } else {
        height = viewportHeight;
        width = viewportHeight * videoRatio;
      }

      const newWidth = Math.ceil(width);
      const newHeight = Math.ceil(height);
      dimensionsRef.current = { width: newWidth, height: newHeight };

      if (containerRef.current) {
        const iframe = containerRef.current.querySelector('iframe');
        if (iframe) {
          iframe.width = String(newWidth);
          iframe.height = String(newHeight);
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    let mounted = true;
    let player: YTPlayer | null = null;

    const initPlayer = async () => {
      try {
        await loadYouTubeIFrameApi();

        if (!mounted || !containerRef.current) return;

        if (containerRef.current.firstChild) {
          containerRef.current.innerHTML = '';
        }

        setIsReady(false);
        setHasInteractionError(false);

        const { width, height } = dimensionsRef.current;

        const playerId = `youtube-player-${Date.now()}`;
        const playerElement = document.createElement('div');
        playerElement.id = playerId;
        containerRef.current.appendChild(playerElement);

        player = new window.YT.Player(playerId, {
          videoId,
          width: width || window.innerWidth,
          height: height || window.innerHeight,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            showinfo: 0,
            loop: 1,
            playlist: videoId,
            mute: 0,
          },
          events: {
            onReady: (event: any) => {
              if (!mounted) return;
              playerRef.current = player;
              setIsReady(true);
              try {
                event.target.setVolume(volumeRef.current);
                // Only play if isPlaying is true
                if (isPlayingRef.current) {
                  event.target.playVideo();
                } else {
                  event.target.pauseVideo();
                }
              } catch (err) {
                setHasInteractionError(true);
                onErrorRef.current?.('Your browser blocked audio. Click anywhere on the page to enable sound.');
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
              onErrorRef.current?.(message);
            },
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.ENDED) {
                // loops via playlist param
              }
            },
          },
        });
      } catch (err) {
        if (mounted) {
          onErrorRef.current?.('Failed to load YouTube player. Please check your internet connection.');
        }
      }
    };

    initPlayer();

    return () => {
      mounted = false;
      if (player) {
        try { player.destroy(); } catch (err) { /* ignore */ }
      }
      playerRef.current = null;
    };
  }, [videoId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Control play/pause based on isPlaying prop
  useEffect(() => {
    if (!isReady || !playerRef.current) return;
    try {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    } catch (err) {
      // ignore
    }
  }, [isPlaying, isReady]);

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
        if (hasInteractionError) {
          if (isPlayingRef.current) {
            playerRef.current.playVideo();
          }
          setHasInteractionError(false);
          onErrorRef.current?.(null);
        }
      } catch (err) {
        if (!hasInteractionError) {
          setHasInteractionError(true);
          onErrorRef.current?.('Your browser blocked audio. Click anywhere on the page and adjust the volume to enable sound.');
        }
      }
    }
  }, [volume, isReady, hasInteractionError]);

  useEffect(() => {
    if (!hasInteractionError) return;
    const handleClick = () => {
      if (playerRef.current) {
        try {
          playerRef.current.unMute();
          playerRef.current.setVolume(volumeRef.current);
          if (isPlayingRef.current) {
            playerRef.current.playVideo();
          }
          setHasInteractionError(false);
          onErrorRef.current?.(null);
        } catch (err) { /* still blocked */ }
      }
    };
    document.addEventListener('click', handleClick, { once: true });
    return () => document.removeEventListener('click', handleClick);
  }, [hasInteractionError]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* YouTube iframe container */}
      <div ref={containerRef} className="youtube-background-wrapper" />
      {/* Slim bottom strip — just enough to cover YouTube watermark */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '8px',
          zIndex: 2,
          pointerEvents: 'none',
          background: '#000000',
        }}
      />
    </div>
  );
});
