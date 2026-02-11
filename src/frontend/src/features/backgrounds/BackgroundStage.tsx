import { useBackgroundContext } from './BackgroundProvider';
import { useEffect, useRef, useState } from 'react';
import { YouTubeBackgroundPlayer } from './YouTubeBackgroundPlayer';
import { Button } from '@/components/ui/button';

export function BackgroundStage() {
  const { backgroundUrl, mediaType, youtubeVideoId, youtubeVolume, brightness, error, setRuntimeError, clearBackground } = useBackgroundContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [youtubeError, setYoutubeError] = useState<string | null>(null);

  // Reset errors when background changes
  useEffect(() => {
    setVideoError(null);
    setImageError(null);
    setYoutubeError(null);
  }, [backgroundUrl, mediaType, youtubeVideoId]);

  useEffect(() => {
    if (videoRef.current && mediaType === 'video') {
      videoRef.current.load();
      videoRef.current.play().catch(() => {
        setVideoError('Video playback failed. Your browser may not support this format.');
      });
    }
  }, [backgroundUrl, mediaType]);

  const handleImageError = () => {
    const errorMsg = 'Image failed to load. The URL may be unreachable or the format may not be supported.';
    setImageError(errorMsg);
    setRuntimeError(errorMsg);
  };

  const handleVideoError = () => {
    const errorMsg = 'Video failed to load. The URL may be unreachable or the format may not be supported.';
    setVideoError(errorMsg);
    setRuntimeError(errorMsg);
  };

  const handleYouTubeError = (errorMsg: string | null) => {
    setYoutubeError(errorMsg);
    setRuntimeError(errorMsg);
    
    // Auto-clear YouTube background on fatal errors (not autoplay warnings)
    if (errorMsg && !errorMsg.toLowerCase().includes('audio') && !errorMsg.toLowerCase().includes('sound')) {
      clearBackground();
    }
  };

  const handleClearBackground = () => {
    clearBackground();
    setVideoError(null);
    setImageError(null);
    setYoutubeError(null);
  };

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
          <YouTubeBackgroundPlayer
            videoId={youtubeVideoId}
            volume={youtubeVolume ?? 50}
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
}
