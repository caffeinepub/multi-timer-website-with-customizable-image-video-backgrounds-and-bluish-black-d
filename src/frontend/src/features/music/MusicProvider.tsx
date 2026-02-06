import { createContext, useContext, ReactNode } from 'react';
import { useMusic } from './useMusic';

interface MusicContextValue {
  sourceUrl: string | null;
  sourceType: 'spotify' | 'apple' | 'direct-audio' | null;
  embedUrl: string | null;
  error: string | null;
  volume: number;
  setMusicSource: (url: string) => void;
  clearMusic: () => void;
  setVolume: (volume: number) => void;
  setPlaybackError: (error: string) => void;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
}

const MusicContext = createContext<MusicContextValue | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const music = useMusic();

  return (
    <MusicContext.Provider value={music}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusicContext() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusicContext must be used within MusicProvider');
  }
  return context;
}
