import { useState, useCallback, useEffect } from 'react';
import { useAccurateInterval } from '../shared/useAccurateInterval';

interface IntervalSettings {
  intervalA: number;
  intervalB: number;
  rounds: number;
}

const DEFAULT_SETTINGS: IntervalSettings = {
  intervalA: 30,
  intervalB: 10,
  rounds: 8,
};

const STORAGE_KEY = 'interval-timer-state';

interface UseIntervalTimerOptions {
  onIntervalComplete?: (interval: 'A' | 'B') => void;
  onCycleComplete?: () => void;
}

export function useIntervalTimer(options?: UseIntervalTimerOptions) {
  const [settings, setSettings] = useState<IntervalSettings>(() => {
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

  const [timeLeft, setTimeLeft] = useState(settings.intervalA);
  const [isRunning, setIsRunning] = useState(false);
  const [currentInterval, setCurrentInterval] = useState<'A' | 'B'>('A');
  const [currentRound, setCurrentRound] = useState(1);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [pausedTime, setPausedTime] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = useCallback((newSettings: Partial<IntervalSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const totalRounds = settings.rounds;

  const getCurrentIntervalDuration = useCallback(() => {
    return currentInterval === 'A' ? settings.intervalA : settings.intervalB;
  }, [currentInterval, settings.intervalA, settings.intervalB]);

  const start = useCallback(() => {
    if (pausedTime !== null) {
      setStartTime(Date.now() - (getCurrentIntervalDuration() - pausedTime) * 1000);
      setPausedTime(null);
    } else {
      setStartTime(Date.now());
    }
    setIsRunning(true);
  }, [pausedTime, getCurrentIntervalDuration]);

  const pause = useCallback(() => {
    setIsRunning(false);
    setPausedTime(timeLeft);
    setStartTime(null);
  }, [timeLeft]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setCurrentInterval('A');
    setCurrentRound(1);
    setTimeLeft(settings.intervalA);
    setStartTime(null);
    setPausedTime(null);
  }, [settings.intervalA]);

  const skip = useCallback(() => {
    if (options?.onIntervalComplete) {
      options.onIntervalComplete(currentInterval);
    }

    if (currentInterval === 'A') {
      setCurrentInterval('B');
      setTimeLeft(settings.intervalB);
      setStartTime(isRunning ? Date.now() : null);
      setPausedTime(null);
    } else {
      if (currentRound >= totalRounds) {
        setIsRunning(false);
        setStartTime(null);
        if (options?.onCycleComplete) {
          options.onCycleComplete();
        }
      } else {
        setCurrentRound((prev) => prev + 1);
        setCurrentInterval('A');
        setTimeLeft(settings.intervalA);
        setStartTime(isRunning ? Date.now() : null);
        setPausedTime(null);
      }
    }
  }, [currentInterval, currentRound, totalRounds, settings.intervalA, settings.intervalB, isRunning, options]);

  useAccurateInterval(
    () => {
      if (startTime) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = getCurrentIntervalDuration() - elapsed;

        if (remaining <= 0) {
          skip();
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
    currentInterval,
    currentRound,
    totalRounds,
    settings,
    updateSettings,
    start,
    pause,
    reset,
    skip,
  };
}
