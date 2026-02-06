import { useBackgroundContext } from './BackgroundProvider';
import { useEffect, useRef, useState } from 'react';
import { buildYouTubeEmbedUrl } from './youtubeUrl';

export function BackgroundStage() {
  const { backgroundUrl, mediaType, youtubeVideoId, error, setRuntimeError } = useBackgroundContext();
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

  const displayError = error || videoError || imageError || youtubeError;

  return (
    <>
      <div className="fixed inset-0 z-0 bg-background" />
      
      {backgroundUrl && mediaType === 'image' && !imageError && (
        <>
          <div
            className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundUrl})` }}
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
          loop
          muted
          playsInline
          onError={handleVideoError}
        >
          <source src={backgroundUrl} />
        </video>
      )}

      {mediaType === 'youtube' && youtubeVideoId && !youtubeError && (
        <iframe
          className="fixed inset-0 z-0 h-full w-full"
          src={buildYouTubeEmbedUrl(youtubeVideoId)}
          allow="autoplay; encrypted-media"
          style={{
            border: 'none',
            pointerEvents: 'none',
            width: '100vw',
            height: '100vh',
          }}
          title="YouTube Background"
          onError={() => {
            const errorMsg = 'YouTube video failed to load. The video may be unavailable or restricted.';
            setYoutubeError(errorMsg);
            setRuntimeError(errorMsg);
          }}
        />
      )}

      {displayError && (
        <div className="fixed inset-0 z-0 flex items-center justify-center bg-background/95 backdrop-blur-sm">
          <div className="max-w-md rounded-lg bg-destructive/20 border border-destructive/30 p-6 text-center backdrop-blur-md">
            <p className="text-sm text-destructive-foreground font-medium">{displayError}</p>
          </div>
        </div>
      )}
    </>
  );
}
