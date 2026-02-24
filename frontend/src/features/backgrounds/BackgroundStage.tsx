import { useBackgroundContext } from './BackgroundProvider';
import { useEffect, useRef, useState, useCallback, memo } from 'react';
import { YouTubeBackgroundPlayer } from './YouTubeBackgroundPlayer';
import { Button } from '@/components/ui/button';

interface YouTubeBackgroundPlayerWithControlsProps {
  videoId: string;
  volume: number;
  isPlaying: boolean;
  onError: (error: string | null) => void;
}

const YouTubeBackgroundPlayerWithControls = memo(function YouTubeBackgroundPlayerWithControls({
  videoId,
  volume,
  isPlaying,
  onError,
}: YouTubeBackgroundPlayerWithControlsProps) {
  return (
    <YouTubeBackgroundPlayer
      videoId={videoId}
      volume={volume}
      isPlaying={isPlaying}
      onError={onError}
    />
  );
});

export const BackgroundStage = memo(function BackgroundStage() {
  const {
    backgroundUrl,
    mediaType,
    youtubeVideoId,
    youtubeVolume,
    brightness,
    error,
    setRuntimeError,
    clearBackground,
    isPlaying,
    togglePlayback,
  } = useBackgroundContext();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [youtubeError, setYoutubeError] = useState<string | null>(null);

  const isVideoBackground = mediaType === 'video' || mediaType === 'youtube';

  // Reset errors when background changes
  useEffect(() => {
    setVideoError(null);
    setImageError(null);
    setYoutubeError(null);
  }, [backgroundUrl, mediaType, youtubeVideoId]);

  // Only load video when the source URL or media type actually changes
  const prevVideoUrlRef = useRef<string | null>(null);
  useEffect(() => {
    if (videoRef.current && mediaType === 'video' && backgroundUrl !== prevVideoUrlRef.current) {
      prevVideoUrlRef.current = backgroundUrl;
      videoRef.current.load();
      // Don't auto-play; playback is controlled by isPlaying state
    }
  }, [backgroundUrl, mediaType]);

  // Control video play/pause based on isPlaying state
  useEffect(() => {
    if (!videoRef.current || mediaType !== 'video') return;
    if (isPlaying) {
      videoRef.current.play().catch(() => {
        setVideoError('Video playback failed. Your browser may not support this format.');
      });
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying, mediaType]);

  // Global spacebar listener for play/pause toggle
  useEffect(() => {
    if (!isVideoBackground) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept spacebar when user is typing in an input
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      if (isInput) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVideoBackground, togglePlayback]);

  const handleImageError = useCallback(() => {
    const errorMsg = 'Image failed to load. The URL may be unreachable or the format may not be supported.';
    setImageError(errorMsg);
    setRuntimeError(errorMsg);
  }, [setRuntimeError]);

  const handleVideoError = useCallback(() => {
    const errorMsg = 'Video failed to load. The URL may be unreachable or the format may not be supported.';
    setVideoError(errorMsg);
    setRuntimeError(errorMsg);
  }, [setRuntimeError]);

  const handleYouTubeError = useCallback((errorMsg: string | null) => {
    setYoutubeError(errorMsg);
    setRuntimeError(errorMsg);
    
    if (errorMsg && !errorMsg.toLowerCase().includes('audio') && !errorMsg.toLowerCase().includes('sound')) {
      clearBackground();
    }
  }, [setRuntimeError, clearBackground]);

  const handleClearBackground = useCallback(() => {
    clearBackground();
    setVideoError(null);
    setImageError(null);
    setYoutubeError(null);
  }, [clearBackground]);

  const displayError = error || videoError || imageError || youtubeError;
  const brightnessValue = (brightness ?? 100) / 100;

  return (
    <>
      <div className="fixed inset-0 z-0 bg-background" />
      
      {backgroundUrl && mediaType === 'image' && !imageError && (
        <>
          <div
            className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${backgroundUrl})`,
              filter: `brightness(${brightnessValue})`
            }}
          />
          <img
            src={backgroundUrl}
            alt=""
            className="hidden"
            onError={handleImageError}
          />
        </>
      )}

      {backgroundUrl && mediaType === 'video' && !videoError && (
        <video
          ref={videoRef}
          className="fixed inset-0 z-0 h-full w-full object-cover"
          style={{ filter: `brightness(${brightnessValue})` }}
          loop
          muted
          playsInline
          onError={handleVideoError}
        >
          <source src={backgroundUrl} />
        </video>
      )}

      {mediaType === 'youtube' && youtubeVideoId && !youtubeError && (
        <div 
          className="fixed inset-0 z-0"
          style={{ filter: `brightness(${brightnessValue})` }}
        >
          <YouTubeBackgroundPlayerWithControls
            videoId={youtubeVideoId}
            volume={youtubeVolume ?? 50}
            isPlaying={isPlaying}
            onError={handleYouTubeError}
          />
        </div>
      )}

      {displayError && (
        <div className="fixed inset-0 z-0 flex items-center justify-center bg-background/95 backdrop-blur-sm">
          <div className="max-w-md rounded-lg bg-destructive/20 border border-destructive/30 p-6 text-center backdrop-blur-md space-y-4">
            <p className="text-sm text-destructive-foreground font-medium">{displayError}</p>
            <Button 
              onClick={handleClearBackground}
              variant="outline"
              size="sm"
              className="bg-background/50 hover:bg-background/70"
            >
              Clear background
            </Button>
          </div>
        </div>
      )}
    </>
  );
});
