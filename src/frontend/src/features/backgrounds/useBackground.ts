import { useState, useEffect } from 'react';
import { inferMediaType } from './mediaSupport';
import { parseYouTubeUrl } from './youtubeUrl';

interface BackgroundState {
  backgroundUrl: string | null;
  mediaType: 'image' | 'video' | 'youtube' | null;
  youtubeVideoId?: string | null;
  error: string | null;
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

  const setBackgroundFromFile = (file: File) => {
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
  };

  const setBackgroundFromUrl = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase() || '';
    const videoExts = ['mp4', 'webm', 'ogg', 'mov'];
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];

    let mediaType: 'image' | 'video' | null = null;
    if (videoExts.includes(extension)) {
      mediaType = 'video';
    } else if (imageExts.includes(extension)) {
      mediaType = 'image';
    } else {
      mediaType = 'image';
    }

    setState({
      backgroundUrl: url,
      mediaType,
      youtubeVideoId: null,
      error: null,
    });
  };

  const setBackgroundFromYouTubeUrl = (url: string) => {
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
  };

  const clearBackground = () => {
    if (state.backgroundUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(state.backgroundUrl);
    }
    setState({
      backgroundUrl: null,
      mediaType: null,
      youtubeVideoId: null,
      error: null,
    });
  };

  return {
    ...state,
    setBackgroundFromFile,
    setBackgroundFromUrl,
    setBackgroundFromYouTubeUrl,
    clearBackground,
  };
}
