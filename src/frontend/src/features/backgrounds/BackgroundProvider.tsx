import { createContext, useContext, ReactNode, useRef, useEffect } from 'react';
import { useBackground } from './useBackground';

interface BackgroundContextValue {
  backgroundUrl: string | null;
  mediaType: 'image' | 'video' | 'youtube' | null;
  youtubeVideoId?: string | null;
  error: string | null;
  isProbing?: boolean;
  setBackgroundFromFile: (file: File) => void;
  setBackgroundFromUrl: (url: string) => Promise<void>;
  setBackgroundFromYouTubeUrl: (url: string) => void;
  clearBackground: () => void;
  setRuntimeError: (error: string | null) => void;
}

const BackgroundContext = createContext<BackgroundContextValue | null>(null);

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const background = useBackground();
  const prevBlobUrlRef = useRef<string | null>(null);

  // Track and revoke previous blob URLs when they change
  useEffect(() => {
    const currentUrl = background.backgroundUrl;
    const prevUrl = prevBlobUrlRef.current;

    // If we have a new blob URL and a previous one, revoke the old one
    if (prevUrl && prevUrl.startsWith('blob:') && prevUrl !== currentUrl) {
      URL.revokeObjectURL(prevUrl);
    }

    // Update the ref to track the current URL
    prevBlobUrlRef.current = currentUrl;

    // Cleanup on unmount
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
