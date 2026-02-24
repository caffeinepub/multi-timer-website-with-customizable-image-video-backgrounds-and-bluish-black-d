import { useState, useEffect, useCallback } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { useBackgroundContext } from './BackgroundProvider';

export function BackgroundFullscreenButton() {
  const { backgroundUrl, mediaType, youtubeVideoId, stageRef } = useBackgroundContext();
  const [isBrowserFullscreen, setIsBrowserFullscreen] = useState(false);

  const hasActiveBackground = !!(backgroundUrl || youtubeVideoId || mediaType);

  // Track browser fullscreen state changes (including Escape key exits)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsBrowserFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    // Safari
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!isBrowserFullscreen) {
      const el = stageRef.current;
      if (!el) return;
      try {
        if (el.requestFullscreen) {
          await el.requestFullscreen();
        } else {
          // Safari fallback
          const safariEl = el as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> };
          if (safariEl.webkitRequestFullscreen) {
            await safariEl.webkitRequestFullscreen();
          }
        }
      } catch {
        // Fullscreen request may be denied (e.g., in iframes)
      }
    } else {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else {
          const doc = document as Document & { webkitExitFullscreen?: () => Promise<void> };
          if (doc.webkitExitFullscreen) {
            await doc.webkitExitFullscreen();
          }
        }
      } catch {
        // Ignore exit errors
      }
    }
  }, [isBrowserFullscreen, stageRef]);

  // Don't render if no background is active
  if (!hasActiveBackground) return null;

  return (
    <button
      onClick={toggleFullscreen}
      aria-label={isBrowserFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      title={isBrowserFullscreen ? 'Exit fullscreen (Esc)' : 'Enter fullscreen'}
      className="fixed z-40 flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      style={{
        bottom: '52px',
        right: '60px',
        width: '48px',
        height: '48px',
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1.5px solid rgba(255,255,255,0.18)',
        boxShadow: '0 2px 16px rgba(0,0,0,0.35)',
      }}
    >
      {isBrowserFullscreen ? (
        <Minimize2 className="h-5 w-5 text-white" />
      ) : (
        <Maximize2 className="h-5 w-5 text-white" />
      )}
    </button>
  );
}
