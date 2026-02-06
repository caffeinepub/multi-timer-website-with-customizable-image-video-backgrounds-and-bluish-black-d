import { useBackground } from './useBackground';
import { useEffect, useRef, useState } from 'react';
import { buildYouTubeEmbedUrl } from './youtubeUrl';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function BackgroundStage() {
  const { backgroundUrl, mediaType, youtubeVideoId, error } = useBackground();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [youtubeWarning, setYoutubeWarning] = useState(false);

  useEffect(() => {
    if (videoRef.current && mediaType === 'video') {
      videoRef.current.load();
      videoRef.current.play().catch(() => {
        setVideoError('Video playback failed. Your browser may not support this format.');
      });
    }
  }, [backgroundUrl, mediaType]);

  useEffect(() => {
    if (mediaType === 'youtube') {
      // Show warning after a brief delay if YouTube might not autoplay
      const timer = setTimeout(() => {
        setYoutubeWarning(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setYoutubeWarning(false);
    }
  }, [mediaType, youtubeVideoId]);

  return (
    <>
      <div className="fixed inset-0 z-0 bg-background" />
      
      {backgroundUrl && mediaType === 'image' && (
        <div
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundUrl})` }}
        />
      )}

      {backgroundUrl && mediaType === 'video' && !videoError && (
        <video
          ref={videoRef}
          className="fixed inset-0 z-0 h-full w-full object-cover"
          loop
          muted
          playsInline
          onError={() => setVideoError('Video failed to load. Format may not be supported.')}
        >
          <source src={backgroundUrl} />
        </video>
      )}

      {mediaType === 'youtube' && youtubeVideoId && (
        <>
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
          />
          {youtubeWarning && (
            <div className="fixed bottom-4 left-1/2 z-[2] w-full max-w-md -translate-x-1/2 px-4">
              <Alert className="bg-background/90 backdrop-blur-sm">
                <AlertDescription className="text-xs">
                  If the video doesn't play automatically, click anywhere on the page to enable autoplay.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </>
      )}

      {(error || videoError) && (
        <div className="fixed inset-0 z-0 flex items-center justify-center bg-background">
          <div className="max-w-md rounded-lg bg-destructive/10 p-6 text-center">
            <p className="text-sm text-destructive-foreground">{error || videoError}</p>
          </div>
        </div>
      )}

      <div className="fixed inset-0 z-[1] bg-background/40 backdrop-blur-[2px]" />
    </>
  );
}
