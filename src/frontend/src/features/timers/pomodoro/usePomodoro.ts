import { useState, useEffect, useCallback } from 'react';
import { useAccurateInterval } from '../shared/useAccurateInterval';

type Segment = 'work' | 'shortBreak' | 'longBreak';

interface PomodoroSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
};

const STORAGE_KEY = 'pomodoro-state';

interface UsePomodoroOptions {
  onSegmentComplete?: (segment: Segment) => void;
}

export function usePomodoro(options?: UsePomodoroOptions) {
  const [settings, setSettings] = useState<PomodoroSettings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_SETTINGS, ...parsed.settings };
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSegment, setCurrentSegment] = useState<Segment>('work');
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [pausedTime, setPausedTime] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ settings, completedPomodoros })
    );
  }, [settings, completedPomodoros]);

  const updateSettings = useCallback((newSettings: Partial<PomodoroSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const getSegmentDuration = useCallback(
    (segment: Segment) => {
      switch (segment) {
        case 'work':
          return settings.workDuration * 60;
        case 'shortBreak':
          return settings.shortBreakDuration * 60;
        case 'longBreak':
          return settings.longBreakDuration * 60;
      }
    },
    [settings]
  );

  const start = useCallback(() => {
    if (pausedTime !== null) {
      setStartTime(Date.now() - (getSegmentDuration(currentSegment) - pausedTime) * 1000);
      setPausedTime(null);
    } else {
      setStartTime(Date.now());
    }
    setIsRunning(true);
  }, [pausedTime, currentSegment, getSegmentDuration]);

  const pause = useCallback(() => {
    setIsRunning(false);
    setPausedTime(timeLeft);
    setStartTime(null);
  }, [timeLeft]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setCurrentSegment('work');
    setTimeLeft(settings.workDuration * 60);
    setStartTime(null);
    setPausedTime(null);
  }, [settings.workDuration]);

  const skip = useCallback(() => {
    let nextSegment: Segment;
    let newCompletedPomodoros = completedPomodoros;

    if (currentSegment === 'work') {
      newCompletedPomodoros += 1;
      setCompletedPomodoros(newCompletedPomodoros);
      
      if (newCompletedPomodoros % settings.longBreakInterval === 0) {
        nextSegment = 'longBreak';
      } else {
        nextSegment = 'shortBreak';
      }
    } else {
      nextSegment = 'work';
    }

    if (options?.onSegmentComplete) {
      options.onSegmentComplete(currentSegment);
    }

    setCurrentSegment(nextSegment);
    const duration = getSegmentDuration(nextSegment);
    setTimeLeft(duration);
    setStartTime(isRunning ? Date.now() : null);
    setPausedTime(null);
  }, [currentSegment, completedPomodoros, settings.longBreakInterval, getSegmentDuration, isRunning, options]);

  useAccurateInterval(
    () => {
      if (startTime) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = getSegmentDuration(currentSegment) - elapsed;

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
    currentSegment,
    completedPomodoros,
    settings,
    updateSettings,
    start,
    pause,
    reset,
    skip,
  };
}
