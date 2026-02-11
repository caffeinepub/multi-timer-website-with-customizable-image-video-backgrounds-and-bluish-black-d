import { useState, useEffect, useCallback } from 'react';
import { inferMediaType, inferMediaTypeFromUrl, isValidUrl, probeImage, probeVideo, getUrlErrorMessage } from './mediaSupport';
import { parseYouTubeUrl } from './youtubeUrl';

interface BackgroundState {
  backgroundUrl: string | null;
  mediaType: 'image' | 'video' | 'youtube' | null;
  youtubeVideoId?: string | null;
  youtubeVolume?: number;
  brightness?: number;
  error: string | null;
  isProbing?: boolean;
}

interface PersistedBackgroundConfig {
  backgroundUrl?: string | null;
  mediaType?: 'image' | 'video' | 'youtube' | null;
  youtubeVideoId?: string | null;
  youtubeVolume?: number;
  brightness?: number;
}

const STORAGE_KEY = 'multitimer-background';
const DEFAULT_YOUTUBE_VOLUME = 50;
const DEFAULT_BRIGHTNESS = 100;

async function validatePersistedBackground(config: PersistedBackgroundConfig): Promise<PersistedBackgroundConfig> {
  // Treat blob URLs as invalid (they don't persist across sessions)
  if (config.backgroundUrl?.startsWith('blob:')) {
    return {
      youtubeVolume: config.youtubeVolume ?? DEFAULT_YOUTUBE_VOLUME,
      brightness: config.brightness ?? DEFAULT_BRIGHTNESS,
    };
  }

  // Validate image backgrounds
  if (config.mediaType === 'image' && config.backgroundUrl) {
    const imageLoads = await probeImage(config.backgroundUrl);
    if (!imageLoads) {
      return {
        youtubeVolume: config.youtubeVolume ?? DEFAULT_YOUTUBE_VOLUME,
        brightness: config.brightness ?? DEFAULT_BRIGHTNESS,
      };
    }
  }

  // Validate video backgrounds
  if (config.mediaType === 'video' && config.backgroundUrl) {
    const videoLoads = await probeVideo(config.backgroundUrl);
    if (!videoLoads) {
      return {
        youtubeVolume: config.youtubeVolume ?? DEFAULT_YOUTUBE_VOLUME,
        brightness: config.brightness ?? DEFAULT_BRIGHTNESS,
      };
    }
  }

  // YouTube backgrounds will be validated at runtime by the player
  // Keep the config as-is for YouTube
  return config;
}

export function useBackground() {
  const [state, setState] = useState<BackgroundState>(() => {
    return { 
      backgroundUrl: null, 
      mediaType: null, 
      youtubeVideoId: null, 
      youtubeVolume: DEFAULT_YOUTUBE_VOLUME, 
      brightness: DEFAULT_BRIGHTNESS,
      error: null 
    };
  });

  const [isInitializing, setIsInitializing] = useState(true);

  // Boot-time validation of persisted background
  useEffect(() => {
    const initializeBackground = async () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setIsInitializing(false);
        return;
      }

      try {
        const parsed = JSON.parse(stored);
        
        // Ensure backward compatibility: add defaults if missing
        const config: PersistedBackgroundConfig = {
          backgroundUrl: parsed.backgroundUrl,
          mediaType: parsed.mediaType,
          youtubeVideoId: parsed.youtubeVideoId,
          youtubeVolume: parsed.youtubeVolume ?? DEFAULT_YOUTUBE_VOLUME,
          brightness: parsed.brightness ?? DEFAULT_BRIGHTNESS,
        };

        // Validate the persisted background
        const validatedConfig = await validatePersistedBackground(config);

        setState({
          backgroundUrl: validatedConfig.backgroundUrl ?? null,
          mediaType: validatedConfig.mediaType ?? null,
          youtubeVideoId: validatedConfig.youtubeVideoId ?? null,
          youtubeVolume: validatedConfig.youtubeVolume ?? DEFAULT_YOUTUBE_VOLUME,
          brightness: validatedConfig.brightness ?? DEFAULT_BRIGHTNESS,
          error: null,
        });
      } catch {
        // Invalid stored data, start fresh
        setState({
          backgroundUrl: null,
          mediaType: null,
          youtubeVideoId: null,
          youtubeVolume: DEFAULT_YOUTUBE_VOLUME,
          brightness: DEFAULT_BRIGHTNESS,
          error: null,
        });
      }

      setIsInitializing(false);
    };

    initializeBackground();
  }, []);

  // Persist only durable configuration (exclude transient runtime fields like error/isProbing)
  useEffect(() => {
    if (isInitializing) return;

    const persistedConfig: PersistedBackgroundConfig = {
      backgroundUrl: state.backgroundUrl,
      mediaType: state.mediaType,
      youtubeVideoId: state.youtubeVideoId,
      youtubeVolume: state.youtubeVolume,
      brightness: state.brightness,
    };

    if (state.backgroundUrl || state.youtubeVideoId) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedConfig));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [state.backgroundUrl, state.mediaType, state.youtubeVideoId, state.youtubeVolume, state.brightness, isInitializing]);

  const setBackgroundFromFile = useCallback((file: File) => {
    const mediaType = inferMediaType(file.type);
    if (!mediaType) {
      setState((prev) => ({
        backgroundUrl: null,
        mediaType: null,
        youtubeVideoId: null,
        youtubeVolume: prev.youtubeVolume ?? DEFAULT_YOUTUBE_VOLUME,
        brightness: prev.brightness ?? DEFAULT_BRIGHTNESS,
        error: 'Unsupported file format. Your browser cannot display this media type.',
      }));
      return;
    }

    const url = URL.createObjectURL(file);
    setState((prev) => ({
      backgroundUrl: url,
      mediaType,
      youtubeVideoId: null,
      youtubeVolume: prev.youtubeVolume ?? DEFAULT_YOUTUBE_VOLUME,
      brightness: prev.brightness ?? DEFAULT_BRIGHTNESS,
      error: null,
    }));
  }, []);

  const setBackgroundFromUrl = useCallback(async (url: string) => {
    // Clear previous state
    setState((prev) => ({ 
      backgroundUrl: null,
      mediaType: null,
      youtubeVideoId: null,
      youtubeVolume: prev.youtubeVolume ?? DEFAULT_YOUTUBE_VOLUME,
      brightness: prev.brightness ?? DEFAULT_BRIGHTNESS,
      error: null, 
      isProbing: true 
    }));

    // Validate URL format
    if (!isValidUrl(url)) {
      setState((prev) => ({
        backgroundUrl: null,
        mediaType: null,
        youtubeVideoId: null,
        youtubeVolume: prev.youtubeVolume ?? DEFAULT_YOUTUBE_VOLUME,
        brightness: prev.brightness ?? DEFAULT_BRIGHTNESS,
        error: getUrlErrorMessage('invalid'),
        isProbing: false,
      }));
      return;
    }

    // Try to infer type from extension first
    const inferredType = inferMediaTypeFromUrl(url);

    if (inferredType) {
      // We have a hint from the extension, verify it loads
      if (inferredType === 'image') {
        const imageLoads = await probeImage(url);
        if (imageLoads) {
          setState((prev) => ({
            backgroundUrl: url,
            mediaType: 'image',
            youtubeVideoId: null,
            youtubeVolume: prev.youtubeVolume ?? DEFAULT_YOUTUBE_VOLUME,
            brightness: prev.brightness ?? DEFAULT_BRIGHTNESS,
            error: null,
            isProbing: false,
          }));
          return;
        }
      } else if (inferredType === 'video') {
        const videoLoads = await probeVideo(url);
        if (videoLoads) {
          setState((prev) => ({
            backgroundUrl: url,
            mediaType: 'video',
            youtubeVideoId: null,
            youtubeVolume: prev.youtubeVolume ?? DEFAULT_YOUTUBE_VOLUME,
            brightness: prev.brightness ?? DEFAULT_BRIGHTNESS,
            error: null,
            isProbing: false,
          }));
          return;
        }
      }
    }

    // No extension hint or probing failed, try both
    const imageLoads = await probeImage(url);
    if (imageLoads) {
      setState((prev) => ({
        backgroundUrl: url,
        mediaType: 'image',
        youtubeVideoId: null,
        youtubeVolume: prev.youtubeVolume ?? DEFAULT_YOUTUBE_VOLUME,
        brightness: prev.brightness ?? DEFAULT_BRIGHTNESS,
        error: null,
        isProbing: false,
      }));
      return;
    }

    const videoLoads = await probeVideo(url);
    if (videoLoads) {
      setState((prev) => ({
        backgroundUrl: url,
        mediaType: 'video',
        youtubeVideoId: null,
        youtubeVolume: prev.youtubeVolume ?? DEFAULT_YOUTUBE_VOLUME,
        brightness: prev.brightness ?? DEFAULT_BRIGHTNESS,
        error: null,
        isProbing: false,
      }));
      return;
    }

    // Neither worked
    setState((prev) => ({
      backgroundUrl: null,
      mediaType: null,
      youtubeVideoId: null,
      youtubeVolume: prev.youtubeVolume ?? DEFAULT_YOUTUBE_VOLUME,
      brightness: prev.brightness ?? DEFAULT_BRIGHTNESS,
      error: getUrlErrorMessage('load-failed'),
      isProbing: false,
    }));
  }, []);

  const setBackgroundFromYouTubeUrl = useCallback((url: string) => {
    const result = parseYouTubeUrl(url);
    
    if ('error' in result) {
      setState((prev) => ({
        backgroundUrl: null,
        mediaType: null,
        youtubeVideoId: null,
        youtubeVolume: prev.youtubeVolume ?? DEFAULT_YOUTUBE_VOLUME,
        brightness: prev.brightness ?? DEFAULT_BRIGHTNESS,
        error: result.error,
      }));
      return;
    }

    setState((prev) => ({
      backgroundUrl: null,
      mediaType: 'youtube',
      youtubeVideoId: result.videoId,
      youtubeVolume: prev.youtubeVolume ?? DEFAULT_YOUTUBE_VOLUME,
      brightness: prev.brightness ?? DEFAULT_BRIGHTNESS,
      error: null,
    }));
  }, []);

  const setYouTubeVolume = useCallback((volume: number) => {
    setState((prev) => ({
      ...prev,
      youtubeVolume: Math.max(0, Math.min(100, volume)),
    }));
  }, []);

  const setBrightness = useCallback((brightness: number) => {
    setState((prev) => ({
      ...prev,
      brightness: Math.max(0, Math.min(100, brightness)),
    }));
  }, []);

  const clearBackground = useCallback(() => {
    setState((prev) => ({
      backgroundUrl: null,
      mediaType: null,
      youtubeVideoId: null,
      youtubeVolume: prev.youtubeVolume ?? DEFAULT_YOUTUBE_VOLUME,
      brightness: prev.brightness ?? DEFAULT_BRIGHTNESS,
      error: null,
    }));
  }, []);

  const setRuntimeError = useCallback((error: string | null) => {
    setState((prev) => ({
      ...prev,
      error,
    }));
  }, []);

  return {
    ...state,
    setBackgroundFromFile,
    setBackgroundFromUrl,
    setBackgroundFromYouTubeUrl,
    setYouTubeVolume,
    setBrightness,
    clearBackground,
    setRuntimeError,
  };
}
