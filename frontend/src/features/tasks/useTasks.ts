import { useState, useEffect } from 'react';
import { safeGetItem, safeSetItem } from '@/lib/safeStorage';

export type ListMode = 'bulleted' | 'numbered' | 'todo';

export interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
}

interface TasksState {
  items: TaskItem[];
  mode: ListMode;
}

const STORAGE_KEY = 'tasks-panel-state';

function loadState(): TasksState {
  const stored = safeGetItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed && Array.isArray(parsed.items) && typeof parsed.mode === 'string') {
        return parsed as TasksState;
      }
    } catch {
      // ignore
    }
  }
  return { items: [], mode: 'bulleted' };
}

export function useTasks() {
  const [state, setState] = useState<TasksState>(loadState);

  useEffect(() => {
    safeSetItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addItem = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setState(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { id: `${Date.now()}-${Math.random()}`, text: trimmed, completed: false },
      ],
    }));
  };

  const toggleItem = (id: string) => {
    setState(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    }));
  };

  const deleteItem = (id: string) => {
    setState(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id),
    }));
  };

  const setMode = (mode: ListMode) => {
    setState(prev => ({ ...prev, mode }));
  };

  const clearAll = () => {
    setState(prev => ({ ...prev, items: [] }));
  };

  return {
    items: state.items,
    mode: state.mode,
    addItem,
    toggleItem,
    deleteItem,
    setMode,
    clearAll,
  };
}
