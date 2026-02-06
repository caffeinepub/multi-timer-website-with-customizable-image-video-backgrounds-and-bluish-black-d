import { useState, useCallback } from 'react';
import { useAccurateInterval } from '../shared/useAccurateInterval';

const STORAGE_KEY = 'countdown-duration';

export function useCountdown() {
  const [duration, setDurationState] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored) : 300;
  });

  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [pausedTime, setPausedTime] = useState<number | null>(null);

  const setDuration = useCallback((newDuration: number) => {
    const validDuration = Math.max(1, newDuration);
    setDurationState(validDuration);
    setTimeLeft(validDuration);
    localStorage.setItem(STORAGE_KEY, validDuration.toString());
  }, []);

  const start = useCallback(() => {
    if (pausedTime !== null) {
      setStartTime(Date.now() - (duration - pausedTime) * 1000);
      setPausedTime(null);
    } else {
      setStartTime(Date.now());
    }
    setIsRunning(true);
  }, [pausedTime, duration]);

  const pause = useCallback(() => {
    setIsRunning(false);
    setPausedTime(timeLeft);
    setStartTime(null);
  }, [timeLeft]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(duration);
    setStartTime(null);
    setPausedTime(null);
  }, [duration]);

  useAccurateInterval(
    () => {
      if (startTime) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = Math.max(0, duration - elapsed);

        if (remaining === 0) {
          setIsRunning(false);
          setStartTime(null);
        }
        setTimeLeft(remaining);
      }
    },
    100,
    isRunning
  );

  return {
    timeLeft,
    isRunning,
    duration,
    setDuration,
    start,
    pause,
    reset,
  };
}
