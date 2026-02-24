import { useState, useEffect, useCallback, useRef } from 'react';
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
  isPlaying: boolean;
  showTimerOverlay: boolean;
}

interface PersistedBackgroundConfig {
  backgroundUrl?: string | null;
  mediaType?: 'image' | 'video' | 'youtube' | null;
  youtubeVideoId?: string | null;
  youtubeVolume?: number;
  brightness?: number;
  showTimerOverlay?: boolean;
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
      showTimerOverlay: config.showTimerOverlay ?? false,
    };
  }

  // Validate image backgrounds
  if (config.mediaType === 'image' && config.backgroundUrl) {
    const imageLoads = await probeImage(config.backgroundUrl);
    if (!imageLoads) {
      return {
        youtubeVolume: config.youtubeVolume ?? DEFAULT_YOUTUBE_VOLUME,
        brightness: config.brightness ?? DEFAULT_BRIGHTNESS,
        showTimerOverlay: config.showTimerOverlay ?? false,
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
        showTimerOverlay: config.showTimerOverlay ?? false,
      };
    }
  }

  // YouTube backgrounds will be validated at runtime by the player
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
      error: null,
      isPlaying: false,
      showTimerOverlay: false,
    };
  });

  const [isInitializing, setIsInitializing] = useState(true);

  // Ref for the background stage element — used by the fullscreen button
  const stageRef = useRef<HTMLDivElement>(null);

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
        
        const config: PersistedBackgroundConfig = {
          backgroundUrl: parsed.backgroundUrl,
          mediaType: parsed.mediaType,
          youtubeVideoId: parsed.youtubeVideoId,
          youtubeVolume: parsed.youtubeVolume ?? DEFAULT_YOUTUBE_VOLUME,
          brightness: parsed.brightness ?? DEFAULT_BRIGHTNESS,
          showTimerOverlay: parsed.showTimerOverlay ?? false,
        };

        const validatedConfig = await validatePersistedBackground(config);

        setState({
          backgroundUrl: validatedConfig.backgroundUrl ?? null,
          mediaType: validatedConfig.mediaType ?? null,
          youtubeVideoId: validatedConfig.youtubeVideoId ?? null,
          youtubeVolume: validatedConfig.youtubeVolume ?? DEFAULT_YOUTUBE_VOLUME,
          brightness: validatedConfig.brightness ?? DEFAULT_BRIGHTNESS,
          error: null,
          isPlaying: false,
          showTimerOverlay: validatedConfig.showTimerOverlay ?? false,
        });
      } catch {
        setState({
          backgroundUrl: null,
          mediaType: null,
          youtubeVideoId: null,
          youtubeVolume: DEFAULT_YOUTUBE_VOLUME,
          brightness: DEFAULT_BRIGHTNESS,
          error: null,
          isPlaying: false,
          showTimerOverlay: false,
        });
      }

      setIsInitializing(false);
    };

    initializeBackground();
  }, []);

  // Persist only durable configuration (exclude transient runtime fields)
  useEffect(() => {
    if (isInitializing) return;

    const persistedConfig: PersistedBackgroundConfig = {
      backgroundUrl: state.backgroundUrl,
      mediaType: state.mediaType,
      youtubeVideoId: state.youtubeVideoId,
      youtubeVolume: state.youtubeVolume,
      brightness: state.brightness,
      showTimerOverlay: state.showTimerOverlay,
    };

    if (state.backgroundUrl || state.youtubeVideoId) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedConfig));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [state.backgroundUrl, state.mediaType, state.youtubeVideoId, state.youtubeVolume, state.brightness, state.showTimerOverlay, isInitializing]);

  const setBackgroundFromFile = useCallback((file: File) => {
    const mediaType = inferMediaType(file.type);
    if (!mediaType) {
      setState((prev) => ({
        ...prev,
        backgroundUrl: null,
        mediaType: null,
        youtubeVideoId: null,
        error: 'Unsupported file format. Your browser cannot display this media type.',
        isPlaying: false,
      }));
      return;
    }

    const url = URL.createObjectURL(file);
    setState((prev) => ({
      ...prev,
      backgroundUrl: url,
      mediaType,
      youtubeVideoId: null,
      error: null,
      isPlaying: false,
    }));
  }, []);

  const setBackgroundFromUrl = useCallback(async (url: string) => {
    setState((prev) => ({ 
      ...prev,
      backgroundUrl: null,
      mediaType: null,
      youtubeVideoId: null,
      error: null, 
      isProbing: true,
      isPlaying: false,
    }));

    if (!isValidUrl(url)) {
      setState((prev) => ({
        ...prev,
        backgroundUrl: null,
        mediaType: null,
        youtubeVideoId: null,
        error: getUrlErrorMessage('invalid'),
        isProbing: false,
        isPlaying: false,
      }));
      return;
    }

    const inferredType = inferMediaTypeFromUrl(url);

    if (inferredType) {
      if (inferredType === 'image') {
        const imageLoads = await probeImage(url);
        if (imageLoads) {
          setState((prev) => ({
            ...prev,
            backgroundUrl: url,
            mediaType: 'image',
            youtubeVideoId: null,
            error: null,
            isProbing: false,
            isPlaying: false,
          }));
          return;
        }
      } else if (inferredType === 'video') {
        const videoLoads = await probeVideo(url);
        if (videoLoads) {
          setState((prev) => ({
            ...prev,
            backgroundUrl: url,
            mediaType: 'video',
            youtubeVideoId: null,
            error: null,
            isProbing: false,
            isPlaying: false,
          }));
          return;
        }
      }
    }

    const imageLoads = await probeImage(url);
    if (imageLoads) {
      setState((prev) => ({
        ...prev,
        backgroundUrl: url,
        mediaType: 'image',
        youtubeVideoId: null,
        error: null,
        isProbing: false,
        isPlaying: false,
      }));
      return;
    }

    const videoLoads = await probeVideo(url);
    if (videoLoads) {
      setState((prev) => ({
        ...prev,
        backgroundUrl: url,
        mediaType: 'video',
        youtubeVideoId: null,
        error: null,
        isProbing: false,
        isPlaying: false,
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      backgroundUrl: null,
      mediaType: null,
      youtubeVideoId: null,
      error: getUrlErrorMessage('load-failed'),
      isProbing: false,
      isPlaying: false,
    }));
  }, []);

  const setBackgroundFromYouTubeUrl = useCallback((url: string) => {
    const result = parseYouTubeUrl(url);
    
    if ('error' in result) {
      setState((prev) => ({
        ...prev,
        backgroundUrl: null,
        mediaType: null,
        youtubeVideoId: null,
        error: result.error,
        isPlaying: false,
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      backgroundUrl: null,
      mediaType: 'youtube',
      youtubeVideoId: result.videoId,
      error: null,
      isPlaying: false,
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
      ...prev,
      backgroundUrl: null,
      mediaType: null,
      youtubeVideoId: null,
      error: null,
      isPlaying: false,
    }));
  }, []);

  const setRuntimeError = useCallback((error: string | null) => {
    setState((prev) => ({
      ...prev,
      error,
    }));
  }, []);

  const setIsPlaying = useCallback((playing: boolean) => {
    setState((prev) => ({
      ...prev,
      isPlaying: playing,
    }));
  }, []);

  const togglePlayback = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }));
  }, []);

  const toggleTimerOverlay = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showTimerOverlay: !prev.showTimerOverlay,
    }));
  }, []);

  // isFullscreen is true when a video/youtube background is playing
  const isVideoBackground = state.mediaType === 'video' || state.mediaType === 'youtube';
  const isFullscreen = isVideoBackground && state.isPlaying;

  return {
    ...state,
    isFullscreen,
    stageRef,
    setBackgroundFromFile,
    setBackgroundFromUrl,
    setBackgroundFromYouTubeUrl,
    setYouTubeVolume,
    setBrightness,
    clearBackground,
    setRuntimeError,
    setIsPlaying,
    togglePlayback,
    toggleTimerOverlay,
  };
}
