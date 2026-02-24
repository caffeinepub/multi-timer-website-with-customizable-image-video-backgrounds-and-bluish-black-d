import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import {
  loadCustomSounds,
  saveCustomSounds,
  generateSoundId,
  canAddMoreSounds,
  convertFileToDataUrl,
  isValidAudioFile,
  type CustomSound,
} from './customSoundsStorage';
import { playYouTubeSound, stopYouTubeSound, isYouTubeUrl } from './youtubeSoundPlayer';

interface CustomSoundsContextType {
  sounds: CustomSound[];
  addSound: (name: string, url: string) => boolean;
  addSoundFromFile: (name: string, file: File) => Promise<boolean>;
  updateSound: (id: string, name: string, url: string) => boolean;
  removeSound: (id: string) => void;
  reorderSounds: (newOrder: CustomSound[]) => void;
  previewSound: (url: string) => Promise<void>;
  canAddMore: boolean;
}

const CustomSoundsContext = createContext<CustomSoundsContextType | undefined>(undefined);

export function CustomSoundsProvider({ children }: { children: React.ReactNode }) {
  const [sounds, setSounds] = useState<CustomSound[]>(() => loadCustomSounds());

  // Persist to localStorage whenever sounds change
  useEffect(() => {
    const result = saveCustomSounds(sounds);
    if (!result.success && result.error) {
      toast.error(result.error);
    }
  }, [sounds]);

  const addSound = useCallback((name: string, url: string): boolean => {
    if (!canAddMoreSounds(sounds.length)) {
      toast.error('Maximum of 10 custom sounds reached');
      return false;
    }

    const trimmedName = name.trim();
    const trimmedUrl = url.trim();

    if (!trimmedName || !trimmedUrl) {
      toast.error('Name and URL are required');
      return false;
    }

    const newSound: CustomSound = {
      id: generateSoundId(),
      name: trimmedName,
      url: trimmedUrl,
    };

    // Test save before adding
    const testResult = saveCustomSounds([...sounds, newSound]);
    if (!testResult.success) {
      toast.error(testResult.error || 'Failed to save sound');
      return false;
    }

    setSounds(prev => [...prev, newSound]);
    toast.success(`Added sound: ${trimmedName}`);
    return true;
  }, [sounds]);

  const addSoundFromFile = useCallback(async (name: string, file: File): Promise<boolean> => {
    if (!canAddMoreSounds(sounds.length)) {
      toast.error('Maximum of 10 custom sounds reached');
      return false;
    }

    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error('Sound name is required');
      return false;
    }

    if (!isValidAudioFile(file)) {
      toast.error('Invalid audio file. Please use MP3, WAV, OGG, or similar audio formats.');
      return false;
    }

    // Check file size (conservative 1MB limit for data URLs)
    if (file.size > 1024 * 1024) {
      toast.error('File is too large. Please use files smaller than 1MB or provide a direct URL instead.');
      return false;
    }

    try {
      const dataUrl = await convertFileToDataUrl(file);
      
      const newSound: CustomSound = {
        id: generateSoundId(),
        name: trimmedName,
        url: dataUrl,
      };

      // Test save before adding
      const testResult = saveCustomSounds([...sounds, newSound]);
      if (!testResult.success) {
        toast.error(testResult.error || 'Failed to save sound. File may be too large.');
        return false;
      }

      setSounds(prev => [...prev, newSound]);
      toast.success(`Added sound: ${trimmedName}`);
      return true;
    } catch (error) {
      console.error('Failed to process audio file:', error);
      toast.error('Failed to process audio file. Please try again.');
      return false;
    }
  }, [sounds]);

  const updateSound = useCallback((id: string, name: string, url: string): boolean => {
    const trimmedName = name.trim();
    const trimmedUrl = url.trim();

    if (!trimmedName || !trimmedUrl) {
      toast.error('Name and URL are required');
      return false;
    }

    setSounds(prev => prev.map(sound => 
      sound.id === id 
        ? { ...sound, name: trimmedName, url: trimmedUrl }
        : sound
    ));
    toast.success(`Updated sound: ${trimmedName}`);
    return true;
  }, []);

  const removeSound = useCallback((id: string) => {
    setSounds(prev => {
      const sound = prev.find(s => s.id === id);
      if (sound) {
        toast.success(`Removed sound: ${sound.name}`);
      }
      return prev.filter(s => s.id !== id);
    });
  }, []);

  const reorderSounds = useCallback((newOrder: CustomSound[]) => {
    setSounds(newOrder);
  }, []);

  const previewSound = useCallback(async (url: string) => {
    try {
      // Stop any currently playing preview
      stopYouTubeSound();

      // Check if it's a YouTube URL
      if (isYouTubeUrl(url)) {
        const success = await playYouTubeSound(url, 50, 2000);
        if (!success) {
          toast.error('Failed to play YouTube sound. The URL may be invalid or the video may be unavailable.');
        }
        return;
      }

      // Otherwise, play as direct audio
      const audio = new Audio(url);
      audio.volume = 0.5;
      await audio.play();
      
      // Auto-stop after 2 seconds
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, 2000);
    } catch (error) {
      console.error('Failed to preview sound:', error);
      toast.error('Failed to play sound. The URL may be invalid or unreachable.');
    }
  }, []);

  const canAddMore = canAddMoreSounds(sounds.length);

  return (
    <CustomSoundsContext.Provider
      value={{
        sounds,
        addSound,
        addSoundFromFile,
        updateSound,
        removeSound,
        reorderSounds,
        previewSound,
        canAddMore,
      }}
    >
      {children}
    </CustomSoundsContext.Provider>
  );
}

export function useCustomSounds() {
  const context = useContext(CustomSoundsContext);
  if (!context) {
    throw new Error('useCustomSounds must be used within CustomSoundsProvider');
  }
  return context;
}
