import { useEffect, useCallback } from 'react';
import { Play, Pause } from 'lucide-react';
import { useBackgroundContext } from './BackgroundProvider';

export function BackgroundPlayButton() {
  const { mediaType, backgroundUrl, youtubeVideoId, isPlaying, isFullscreen, togglePlayback } = useBackgroundContext();

  const isVideoBackground = mediaType === 'video' || mediaType === 'youtube';
  const hasMedia = !!(backgroundUrl || youtubeVideoId);

  // Don't render if no video background is active
  if (!isVideoBackground || !hasMedia) return null;

  // Hide the button during fullscreen playback
  if (isFullscreen) return null;

  return (
    <button
      onClick={togglePlayback}
      aria-label={isPlaying ? 'Pause video' : 'Play video'}
      title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
      className="fixed bottom-12 right-4 z-40 flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      style={{
        width: '48px',
        height: '48px',
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1.5px solid rgba(255,255,255,0.18)',
        boxShadow: '0 2px 16px rgba(0,0,0,0.35)',
      }}
    >
      {isPlaying ? (
        <Pause className="h-5 w-5 text-white" />
      ) : (
        <Play className="h-5 w-5 text-white translate-x-0.5" />
      )}
    </button>
  );
}
