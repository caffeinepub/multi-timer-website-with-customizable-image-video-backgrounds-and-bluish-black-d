import { useState, useEffect, useCallback } from 'react';
import { inferMediaType, inferMediaTypeFromUrl, isValidUrl, probeImage, probeVideo, getUrlErrorMessage } from './mediaSupport';
import { parseYouTubeUrl } from './youtubeUrl';

interface BackgroundState {
  backgroundUrl: string | null;
  mediaType: 'image' | 'video' | 'youtube' | null;
  youtubeVideoId?: string | null;
  error: string | null;
  isProbing?: boolean;
}

const STORAGE_KEY = 'multitimer-background';

export function useBackground() {
  const [state, setState] = useState<BackgroundState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { backgroundUrl: null, mediaType: null, youtubeVideoId: null, error: null };
      }
    }
    return { backgroundUrl: null, mediaType: null, youtubeVideoId: null, error: null };
  });

  useEffect(() => {
    if (state.backgroundUrl || state.youtubeVideoId || state.error) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [state]);

  const setBackgroundFromFile = useCallback((file: File) => {
    const mediaType = inferMediaType(file.type);
    if (!mediaType) {
      setState({
        backgroundUrl: null,
        mediaType: null,
        youtubeVideoId: null,
        error: 'Unsupported file format. Your browser cannot display this media type.',
      });
      return;
    }

    const url = URL.createObjectURL(file);
    setState({
      backgroundUrl: url,
      mediaType,
      youtubeVideoId: null,
      error: null,
    });
  }, []);

  const setBackgroundFromUrl = useCallback(async (url: string) => {
    // Clear previous state
    setState((prev) => ({ 
      backgroundUrl: null,
      mediaType: null,
      youtubeVideoId: null,
      error: null, 
      isProbing: true 
    }));

    // Validate URL format
    if (!isValidUrl(url)) {
      setState({
        backgroundUrl: null,
        mediaType: null,
        youtubeVideoId: null,
        error: getUrlErrorMessage('invalid'),
        isProbing: false,
      });
      return;
    }

    // Try to infer type from extension first
    const inferredType = inferMediaTypeFromUrl(url);

    if (inferredType) {
      // We have a hint from the extension, verify it loads
      if (inferredType === 'image') {
        const imageLoads = await probeImage(url);
        if (imageLoads) {
          setState({
            backgroundUrl: url,
            mediaType: 'image',
            youtubeVideoId: null,
            error: null,
            isProbing: false,
          });
          return;
        }
      } else if (inferredType === 'video') {
        const videoLoads = await probeVideo(url);
        if (videoLoads) {
          setState({
            backgroundUrl: url,
            mediaType: 'video',
            youtubeVideoId: null,
            error: null,
            isProbing: false,
          });
          return;
        }
      }
      
      // Extension suggested a type but it failed to load
      setState({
        backgroundUrl: null,
        mediaType: null,
        youtubeVideoId: null,
        error: getUrlErrorMessage('load-failed'),
        isProbing: false,
      });
      return;
    }

    // No extension hint, probe both types
    const [imageLoads, videoLoads] = await Promise.all([
      probeImage(url),
      probeVideo(url),
    ]);

    if (imageLoads) {
      setState({
        backgroundUrl: url,
        mediaType: 'image',
        youtubeVideoId: null,
        error: null,
        isProbing: false,
      });
      return;
    }

    if (videoLoads) {
      setState({
        backgroundUrl: url,
        mediaType: 'video',
        youtubeVideoId: null,
        error: null,
        isProbing: false,
      });
      return;
    }

    // Neither worked
    setState({
      backgroundUrl: null,
      mediaType: null,
      youtubeVideoId: null,
      error: getUrlErrorMessage('load-failed'),
      isProbing: false,
    });
  }, []);

  const setBackgroundFromYouTubeUrl = useCallback((url: string) => {
    const result = parseYouTubeUrl(url);
    
    if ('error' in result) {
      setState((prev) => ({
        ...prev,
        error: result.error,
      }));
      return;
    }

    setState({
      backgroundUrl: null,
      mediaType: 'youtube',
      youtubeVideoId: result.videoId,
      error: null,
    });
  }, []);

  const clearBackground = useCallback(() => {
    setState({
      backgroundUrl: null,
      mediaType: null,
      youtubeVideoId: null,
      error: null,
    });
  }, []);

  const setRuntimeError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  return {
    ...state,
    setBackgroundFromFile,
    setBackgroundFromUrl,
    setBackgroundFromYouTubeUrl,
    clearBackground,
    setRuntimeError,
  };
}
