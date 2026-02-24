import { useState, useEffect, useCallback } from 'react';
import { safeGetItem, safeSetItem } from '@/lib/safeStorage';

const VISIBILITY_STORAGE_KEY = 'multitimer-timer-visibility';
const SESSION_KEY = 'multitimer-timer-visibility-session';
const TOGGLE_A_KEY = 'multitimer-toggle-a';
const TOGGLE_B_KEY = 'multitimer-toggle-b';

interface TimerVisibilityState {
  isVisible: boolean;
  hasUserToggled: boolean;
}

export function useTimerVisibility(hasActiveBackground: boolean) {
  const [state, setState] = useState<TimerVisibilityState>(() => {
    const stored = safeGetItem(VISIBILITY_STORAGE_KEY, 'local');
    const sessionToggled = safeGetItem(SESSION_KEY, 'session');

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

  const [toggleA, setToggleAState] = useState<boolean>(() => {
    return safeGetItem(TOGGLE_A_KEY, 'local') === 'true';
  });

  const [toggleB, setToggleBState] = useState<boolean>(() => {
    return safeGetItem(TOGGLE_B_KEY, 'local') === 'true';
  });

  // Persist visibility state
  useEffect(() => {
    safeSetItem(VISIBILITY_STORAGE_KEY, JSON.stringify({ isVisible: state.isVisible }), 'local');
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
    safeSetItem(SESSION_KEY, 'true', 'session');
  }, []);

  const toggleA_fn = useCallback(() => {
    setToggleAState(prev => {
      const next = !prev;
      safeSetItem(TOGGLE_A_KEY, String(next), 'local');
      return next;
    });
  }, []);

  const toggleB_fn = useCallback(() => {
    setToggleBState(prev => {
      const next = !prev;
      safeSetItem(TOGGLE_B_KEY, String(next), 'local');
      return next;
    });
  }, []);

  return {
    isVisible: state.isVisible,
    toggleVisibility,
    toggleA,
    toggleA_fn,
    toggleB,
    toggleB_fn,
  };
}
