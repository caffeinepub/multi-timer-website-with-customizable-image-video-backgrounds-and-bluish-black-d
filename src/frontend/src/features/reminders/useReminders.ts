import { useState, useCallback, useEffect } from 'react';

export interface Reminder {
  id: string;
  title: string;
  dueDate: string;
  createdAt: string;
}

const STORAGE_KEY = 'reminders';

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
  }, [reminders]);

  const addReminder = useCallback((title: string, dueDate: string) => {
    const newReminder: Reminder = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title,
      dueDate,
      createdAt: new Date().toISOString(),
    };
    setReminders((prev) => [...prev, newReminder]);
  }, []);

  const updateReminder = useCallback((id: string, title: string, dueDate: string) => {
    setReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === id ? { ...reminder, title, dueDate } : reminder
      )
    );
  }, []);

  const deleteReminder = useCallback((id: string) => {
    setReminders((prev) => prev.filter((reminder) => reminder.id !== id));
  }, []);

  return {
    reminders,
    addReminder,
    updateReminder,
    deleteReminder,
  };
}
