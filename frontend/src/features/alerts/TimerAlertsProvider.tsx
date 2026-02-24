import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { playAlertSound, type AlertSoundOption, ALERT_SOUNDS } from './alertSounds';
import { useCustomSounds } from '../sounds/CustomSoundsProvider';

interface TimerAlertsContextType {
  alertsEnabled: boolean;
  setAlertsEnabled: (enabled: boolean) => void;
  completionSound: AlertSoundOption;
  setCompletionSound: (sound: AlertSoundOption) => void;
  notifyCompletion: (message: string) => void;
  previewSound: (sound: AlertSoundOption) => Promise<void>;
}

const TimerAlertsContext = createContext<TimerAlertsContextType | undefined>(undefined);

const ALERTS_ENABLED_KEY = 'timer-alerts-enabled';
const COMPLETION_SOUND_KEY = 'timer-completion-sound';

export function TimerAlertsProvider({ children }: { children: React.ReactNode }) {
  const { sounds: customSounds } = useCustomSounds();
  
  const [alertsEnabled, setAlertsEnabledState] = useState(() => {
    const stored = localStorage.getItem(ALERTS_ENABLED_KEY);
    return stored !== null ? stored === 'true' : true;
  });

  const [completionSound, setCompletionSoundState] = useState<AlertSoundOption>(() => {
    const stored = localStorage.getItem(COMPLETION_SOUND_KEY);
    return (stored as AlertSoundOption) || 'beep';
  });

  // Validate that the selected sound still exists (for custom sounds)
  useEffect(() => {
    if (completionSound.startsWith('custom-')) {
      const soundExists = customSounds.some(s => s.id === completionSound);
      if (!soundExists) {
        // Fallback to beep if custom sound was deleted
        setCompletionSoundState('beep');
        localStorage.setItem(COMPLETION_SOUND_KEY, 'beep');
      }
    }
  }, [customSounds, completionSound]);

  useEffect(() => {
    localStorage.setItem(ALERTS_ENABLED_KEY, alertsEnabled.toString());
  }, [alertsEnabled]);

  useEffect(() => {
    localStorage.setItem(COMPLETION_SOUND_KEY, completionSound);
  }, [completionSound]);

  const setAlertsEnabled = useCallback((enabled: boolean) => {
    setAlertsEnabledState(enabled);
  }, []);

  const setCompletionSound = useCallback((sound: AlertSoundOption) => {
    setCompletionSoundState(sound);
  }, []);

  const getCustomSoundUrl = useCallback((soundId: string): string | undefined => {
    const sound = customSounds.find(s => s.id === soundId);
    return sound?.url;
  }, [customSounds]);

  const previewSound = useCallback(async (sound: AlertSoundOption) => {
    const customUrl = sound.startsWith('custom-') ? getCustomSoundUrl(sound) : undefined;
    const success = await playAlertSound(sound, customUrl);
    
    if (!success && sound.startsWith('custom-')) {
      toast.error('Could not play custom sound. The URL may be invalid or the video may be unavailable.');
    }
  }, [getCustomSoundUrl]);

  const notifyCompletion = useCallback(async (message: string) => {
    if (alertsEnabled) {
      toast.success(message, {
        duration: 5000,
        position: 'top-center',
      });
      
      // Play the selected completion sound
      const customUrl = completionSound.startsWith('custom-') ? getCustomSoundUrl(completionSound) : undefined;
      const success = await playAlertSound(completionSound, customUrl);
      
      if (!success && completionSound.startsWith('custom-')) {
        toast.error('Could not play completion sound. The URL may be invalid or playback may be blocked by your browser.');
      }
    }
  }, [alertsEnabled, completionSound, getCustomSoundUrl]);

  return (
    <TimerAlertsContext.Provider value={{ 
      alertsEnabled, 
      setAlertsEnabled, 
      completionSound,
      setCompletionSound,
      notifyCompletion,
      previewSound,
    }}>
      {children}
    </TimerAlertsContext.Provider>
  );
}

export function useTimerAlerts() {
  const context = useContext(TimerAlertsContext);
  if (!context) {
    throw new Error('useTimerAlerts must be used within TimerAlertsProvider');
  }
  return context;
}
