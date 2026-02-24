import { useState, useEffect } from 'react';
import { TimerMode } from '@/App';
import { DEFAULT_TIMER_ORDER } from './timerModes';

const STORAGE_KEY = 'timer-tab-order';

function normalizeOrder(stored: unknown): TimerMode[] {
  if (!Array.isArray(stored)) {
    return DEFAULT_TIMER_ORDER;
  }

  const validIds = new Set(DEFAULT_TIMER_ORDER);
  const normalized = stored.filter((id): id is TimerMode => 
    typeof id === 'string' && validIds.has(id as TimerMode)
  );

  // Remove duplicates
  const unique = Array.from(new Set(normalized));

  // Add any missing timer IDs at the end
  const missing = DEFAULT_TIMER_ORDER.filter(id => !unique.includes(id));
  
  return [...unique, ...missing];
}

export function useTimerTabOrder() {
  const [order, setOrder] = useState<TimerMode[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return normalizeOrder(parsed);
      }
    } catch (error) {
      console.warn('Failed to load timer tab order:', error);
    }
    return DEFAULT_TIMER_ORDER;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
    } catch (error) {
      console.warn('Failed to save timer tab order:', error);
    }
  }, [order]);

  const resetOrder = () => {
    setOrder(DEFAULT_TIMER_ORDER);
  };

  return { order, setOrder, resetOrder };
}
