import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

interface TimerAlertsContextType {
  alertsEnabled: boolean;
  setAlertsEnabled: (enabled: boolean) => void;
  notifyCompletion: (message: string) => void;
}

const TimerAlertsContext = createContext<TimerAlertsContextType | undefined>(undefined);

const STORAGE_KEY = 'timer-alerts-enabled';

export function TimerAlertsProvider({ children }: { children: React.ReactNode }) {
  const [alertsEnabled, setAlertsEnabledState] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored !== null ? stored === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, alertsEnabled.toString());
  }, [alertsEnabled]);

  const setAlertsEnabled = useCallback((enabled: boolean) => {
    setAlertsEnabledState(enabled);
  }, []);

  const notifyCompletion = useCallback((message: string) => {
    if (alertsEnabled) {
      toast.success(message, {
        duration: 5000,
        position: 'top-center',
      });
      
      // Play a short beep sound
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      } catch (error) {
        console.warn('Could not play alert sound:', error);
      }
    }
  }, [alertsEnabled]);

  return (
    <TimerAlertsContext.Provider value={{ alertsEnabled, setAlertsEnabled, notifyCompletion }}>
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
