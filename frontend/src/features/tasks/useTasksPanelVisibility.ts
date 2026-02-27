import { useState, useEffect } from 'react';
import { safeGetItem, safeSetItem } from '@/lib/safeStorage';

const STORAGE_KEY = 'tasks-panel-visible';

export function useTasksPanelVisibility() {
  const [isVisible, setIsVisible] = useState(() => {
    const stored = safeGetItem(STORAGE_KEY);
    return stored === 'true';
  });

  useEffect(() => {
    safeSetItem(STORAGE_KEY, isVisible.toString());
  }, [isVisible]);

  const toggle = () => setIsVisible(prev => !prev);

  return { isVisible, toggle };
}
