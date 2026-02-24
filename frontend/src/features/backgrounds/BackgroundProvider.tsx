import { createContext, useContext, ReactNode, useRef, useEffect, RefObject } from 'react';
import { useBackground } from './useBackground';

interface BackgroundContextValue {
  backgroundUrl: string | null;
  mediaType: 'image' | 'video' | 'youtube' | null;
  youtubeVideoId?: string | null;
  youtubeVolume?: number;
  brightness?: number;
  error: string | null;
  isProbing?: boolean;
  isPlaying: boolean;
  isFullscreen: boolean;
  showTimerOverlay: boolean;
  stageRef: RefObject<HTMLDivElement | null>;
  setBackgroundFromFile: (file: File) => void;
  setBackgroundFromUrl: (url: string) => Promise<void>;
  setBackgroundFromYouTubeUrl: (url: string) => void;
  setYouTubeVolume: (volume: number) => void;
  setBrightness: (brightness: number) => void;
  clearBackground: () => void;
  setRuntimeError: (error: string | null) => void;
  setIsPlaying: (playing: boolean) => void;
  togglePlayback: () => void;
  toggleTimerOverlay: () => void;
}

const BackgroundContext = createContext<BackgroundContextValue | null>(null);

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const background = useBackground();
  const prevBlobUrlRef = useRef<string | null>(null);

  // Track and revoke previous blob URLs when they change
  useEffect(() => {
    const currentUrl = background.backgroundUrl;
    const prevUrl = prevBlobUrlRef.current;

    if (prevUrl && prevUrl.startsWith('blob:') && prevUrl !== currentUrl) {
      URL.revokeObjectURL(prevUrl);
    }

    prevBlobUrlRef.current = currentUrl;

    return () => {
      if (prevBlobUrlRef.current?.startsWith('blob:')) {
        URL.revokeObjectURL(prevBlobUrlRef.current);
      }
    };
  }, [background.backgroundUrl]);

  return (
    <BackgroundContext.Provider value={background}>
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackgroundContext() {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error('useBackgroundContext must be used within BackgroundProvider');
  }
  return context;
}
