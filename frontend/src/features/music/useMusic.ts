import { useState, useEffect, useCallback, useRef } from 'react';
import { parseMusicUrl, type MusicUrlResult } from './musicSupport';

interface MusicState {
  sourceUrl: string | null;
  sourceType: 'spotify' | 'apple' | 'direct-audio' | null;
  embedUrl: string | null;
  error: string | null;
  volume: number;
}

const MUSIC_STORAGE_KEY = 'multitimer-music';
const VOLUME_STORAGE_KEY = 'multitimer-music-volume';
const DEFAULT_VOLUME = 0.5;

export function useMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [state, setState] = useState<MusicState>(() => {
    const stored = localStorage.getItem(MUSIC_STORAGE_KEY);
    const storedVolume = localStorage.getItem(VOLUME_STORAGE_KEY);
    
    let initialState: MusicState = {
      sourceUrl: null,
      sourceType: null,
      embedUrl: null,
      error: null,
      volume: DEFAULT_VOLUME,
    };
    
    if (storedVolume) {
      try {
        const vol = parseFloat(storedVolume);
        if (!isNaN(vol) && vol >= 0 && vol <= 1) {
          initialState.volume = vol;
        }
      } catch {
        // Use default
      }
    }
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return { ...initialState, ...parsed };
      } catch {
        return initialState;
      }
    }
    
    return initialState;
  });

  // Persist music state
  useEffect(() => {
    if (state.sourceUrl || state.error) {
      const toStore = {
        sourceUrl: state.sourceUrl,
        sourceType: state.sourceType,
        embedUrl: state.embedUrl,
        error: state.error,
      };
      localStorage.setItem(MUSIC_STORAGE_KEY, JSON.stringify(toStore));
    } else {
      localStorage.removeItem(MUSIC_STORAGE_KEY);
    }
  }, [state.sourceUrl, state.sourceType, state.embedUrl, state.error]);

  // Persist volume
  useEffect(() => {
    localStorage.setItem(VOLUME_STORAGE_KEY, state.volume.toString());
  }, [state.volume]);

  // Apply volume to audio element when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume;
    }
  }, [state.volume]);

  const setMusicSource = useCallback((url: string) => {
    const result = parseMusicUrl(url);
    
    if (result.type === 'unknown') {
      setState(prev => ({
        ...prev,
        sourceUrl: null,
        sourceType: null,
        embedUrl: null,
        error: result.error,
      }));
      return;
    }
    
    if (result.type === 'direct-audio') {
      setState(prev => ({
        ...prev,
        sourceUrl: result.url,
        sourceType: 'direct-audio',
        embedUrl: null,
        error: null,
      }));
      return;
    }
    
    if (result.type === 'spotify') {
      setState(prev => ({
        ...prev,
        sourceUrl: url,
        sourceType: 'spotify',
        embedUrl: result.embedUrl,
        error: null,
      }));
      return;
    }
    
    if (result.type === 'apple') {
      setState(prev => ({
        ...prev,
        sourceUrl: url,
        sourceType: 'apple',
        embedUrl: result.embedUrl,
        error: null,
      }));
      return;
    }
  }, []);

  const clearMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    
    setState(prev => ({
      ...prev,
      sourceUrl: null,
      sourceType: null,
      embedUrl: null,
      error: null,
    }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    setState(prev => ({
      ...prev,
      volume: clampedVolume,
    }));
  }, []);

  const setPlaybackError = useCallback((error: string) => {
    setState(prev => ({
      ...prev,
      error,
    }));
  }, []);

  return {
    ...state,
    setMusicSource,
    clearMusic,
    setVolume,
    setPlaybackError,
    audioRef,
  };
}
