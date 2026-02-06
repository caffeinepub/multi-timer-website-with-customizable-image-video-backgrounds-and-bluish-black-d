import { useState, useCallback } from 'react';
import { useAccurateInterval } from '../shared/useAccurateInterval';

export function useStopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [laps, setLaps] = useState<number[]>([]);

  const start = useCallback(() => {
    setStartTime(Date.now() - elapsed);
    setIsRunning(true);
  }, [elapsed]);

  const pause = useCallback(() => {
    setIsRunning(false);
    setStartTime(null);
  }, []);

  const reset = useCallback(() => {
    setElapsed(0);
    setIsRunning(false);
    setStartTime(null);
    setLaps([]);
  }, []);

  const recordLap = useCallback(() => {
    setLaps((prev) => [elapsed, ...prev]);
  }, [elapsed]);

  useAccurateInterval(
    () => {
      if (startTime) {
        setElapsed(Date.now() - startTime);
      }
    },
    10,
    isRunning
  );

  return {
    elapsed,
    isRunning,
    laps,
    start,
    pause,
    reset,
    recordLap,
  };
}
