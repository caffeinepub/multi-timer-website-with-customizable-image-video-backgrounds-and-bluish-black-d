import { useEffect, memo } from 'react';
import { useMusicContext } from './MusicProvider';

export const MusicStage = memo(function MusicStage() {
  const { sourceType, sourceUrl, embedUrl, volume, audioRef, setPlaybackError } = useMusicContext();

  // Handle direct audio playback
  useEffect(() => {
    if (sourceType === 'direct-audio' && sourceUrl && audioRef.current) {
      const audio = audioRef.current;
      audio.src = sourceUrl;
      audio.volume = volume;
      audio.loop = true;
      
      const handleError = () => {
        setPlaybackError('Failed to load audio. Please verify the link is accessible and try again.');
      };
      
      audio.addEventListener('error', handleError);
      
      audio.play().catch(() => {
        setPlaybackError('Failed to play audio. Please check your browser settings and try again.');
      });
      
      return () => {
        audio.removeEventListener('error', handleError);
        audio.pause();
      };
    }
  }, [sourceType, sourceUrl, volume, audioRef, setPlaybackError]);

  return (
    <>
      {/* Hidden audio element for direct audio playback */}
      {sourceType === 'direct-audio' && (
        <audio ref={audioRef} style={{ display: 'none' }} />
      )}
      
      {/* Spotify embed */}
      {sourceType === 'spotify' && embedUrl && (
        <iframe
          src={embedUrl}
          width="0"
          height="0"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          style={{ position: 'fixed', bottom: '-100px', left: '-100px', pointerEvents: 'none' }}
        />
      )}
      
      {/* Apple Music embed */}
      {sourceType === 'apple' && embedUrl && (
        <iframe
          src={embedUrl}
          width="0"
          height="0"
          frameBorder="0"
          allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
          sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
          style={{ position: 'fixed', bottom: '-100px', left: '-100px', pointerEvents: 'none' }}
        />
      )}
    </>
  );
});
