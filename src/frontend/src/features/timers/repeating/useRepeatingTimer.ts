import { useState, useCallback, useEffect } from 'react';
import { useAccurateInterval } from '../shared/useAccurateInterval';

interface RepeatingSettings {
  duration: number;
  repeatCount: number;
  infinite: boolean;
}

const DEFAULT_SETTINGS: RepeatingSettings = {
  duration: 60,
  repeatCount: 5,
  infinite: false,
};

const STORAGE_KEY = 'repeating-timer-state';

export function useRepeatingTimer() {
  const [settings, setSettings] = useState<RepeatingSettings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [timeLeft, setTimeLeft] = useState(settings.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [completedRepeats, setCompletedRepeats] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [pausedTime, setPausedTime] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = useCallback((newSettings: Partial<RepeatingSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const start = useCallback(() => {
    if (pausedTime !== null) {
      setStartTime(Date.now() - (settings.duration - pausedTime) * 1000);
      setPausedTime(null);
    } else {
      setStartTime(Date.now());
    }
    setIsRunning(true);
  }, [pausedTime, settings.duration]);

  const pause = useCallback(() => {
    setIsRunning(false);
    setPausedTime(timeLeft);
    setStartTime(null);
  }, [timeLeft]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(settings.duration);
    setCompletedRepeats(0);
    setStartTime(null);
    setPausedTime(null);
  }, [settings.duration]);

  useAccurateInterval(
    () => {
      if (startTime) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = settings.duration - elapsed;

        if (remaining <= 0) {
          const newCompletedRepeats = completedRepeats + 1;
          setCompletedRepeats(newCompletedRepeats);

          if (!settings.infinite && newCompletedRepeats >= settings.repeatCount) {
            setIsRunning(false);
            setTimeLeft(0);
            setStartTime(null);
          } else {
            setTimeLeft(settings.duration);
            setStartTime(Date.now());
          }
        } else {
          setTimeLeft(remaining);
        }
      }
    },
    100,
    isRunning
  );

  return {
    timeLeft,
    isRunning,
    completedRepeats,
    settings,
    updateSettings,
    start,
    pause,
    reset,
  };
}
