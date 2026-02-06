import { useState, useEffect, useCallback } from 'react';

const VISIBILITY_STORAGE_KEY = 'multitimer-timer-visibility';
const SESSION_KEY = 'multitimer-timer-visibility-session';

interface TimerVisibilityState {
  isVisible: boolean;
  hasUserToggled: boolean;
}

export function useTimerVisibility(hasActiveBackground: boolean) {
  const [state, setState] = useState<TimerVisibilityState>(() => {
    const stored = localStorage.getItem(VISIBILITY_STORAGE_KEY);
    const sessionToggled = sessionStorage.getItem(SESSION_KEY);
    
    let initialState: TimerVisibilityState = {
      isVisible: true,
      hasUserToggled: sessionToggled === 'true',
    };
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        initialState.isVisible = parsed.isVisible ?? true;
      } catch {
        // Use default
      }
    }
    
    return initialState;
  });

  // Persist visibility state
  useEffect(() => {
    localStorage.setItem(VISIBILITY_STORAGE_KEY, JSON.stringify({ isVisible: state.isVisible }));
  }, [state.isVisible]);

  // Auto-hide timer when background becomes active (unless user has toggled)
  useEffect(() => {
    if (hasActiveBackground && !state.hasUserToggled) {
      setState(prev => ({ ...prev, isVisible: false }));
    }
  }, [hasActiveBackground, state.hasUserToggled]);

  const toggleVisibility = useCallback(() => {
    setState(prev => ({
      isVisible: !prev.isVisible,
      hasUserToggled: true,
    }));
    sessionStorage.setItem(SESSION_KEY, 'true');
  }, []);

  return {
    isVisible: state.isVisible,
    toggleVisibility,
  };
}
