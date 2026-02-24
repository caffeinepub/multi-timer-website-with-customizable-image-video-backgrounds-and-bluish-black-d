import { useState, useEffect } from 'react';
import { NavigationTabId, DEFAULT_NAVIGATION_ORDER } from './navigationTabs';
import { safeGetItem, safeSetItem } from '@/lib/safeStorage';

const STORAGE_KEY = 'navigation-tab-order';

function normalizeOrder(stored: unknown): NavigationTabId[] {
  if (!Array.isArray(stored)) {
    return DEFAULT_NAVIGATION_ORDER;
  }

  const validIds = new Set(DEFAULT_NAVIGATION_ORDER);
  const normalized = stored.filter((id): id is NavigationTabId => 
    typeof id === 'string' && validIds.has(id as NavigationTabId)
  );

  // Remove duplicates
  const unique = Array.from(new Set(normalized));

  // Add any missing navigation IDs at the end
  const missing = DEFAULT_NAVIGATION_ORDER.filter(id => !unique.includes(id));
  
  return [...unique, ...missing];
}

export function useNavigationTabOrder() {
  const [order, setOrder] = useState<NavigationTabId[]>(() => {
    try {
      const stored = safeGetItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return normalizeOrder(parsed);
      }
    } catch (error) {
      console.warn('Failed to load navigation tab order:', error);
    }
    return DEFAULT_NAVIGATION_ORDER;
  });

  useEffect(() => {
    try {
      safeSetItem(STORAGE_KEY, JSON.stringify(order));
    } catch (error) {
      console.warn('Failed to save navigation tab order:', error);
    }
  }, [order]);

  const resetOrder = () => {
    setOrder(DEFAULT_NAVIGATION_ORDER);
  };

  return { order, setOrder, resetOrder };
}
