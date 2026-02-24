import { useEffect, useRef } from 'react';
import { useReminders } from './useReminders';
import { useTimerAlerts } from '../alerts/TimerAlertsProvider';

/**
 * Monitors reminders and triggers notifications when they become due.
 * Runs silently in the background without rendering any UI.
 */
export function RemindersDueNotifier() {
  const { reminders } = useReminders();
  const { notifyCompletion, alertsEnabled } = useTimerAlerts();
  const notifiedIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!alertsEnabled) {
      return;
    }

    const checkInterval = setInterval(() => {
      const now = new Date();
      
      reminders.forEach((reminder) => {
        // Skip if already notified
        if (notifiedIds.current.has(reminder.id)) {
          return;
        }

        const dueDate = new Date(reminder.dueDate);
        
        // Check if reminder is due (within 1 minute tolerance)
        if (dueDate <= now) {
          notifiedIds.current.add(reminder.id);
          notifyCompletion(`Reminder: ${reminder.title}`);
        }
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(checkInterval);
  }, [reminders, notifyCompletion, alertsEnabled]);

  // Clean up notified IDs when reminders are deleted
  useEffect(() => {
    const currentIds = new Set(reminders.map(r => r.id));
    notifiedIds.current.forEach((id) => {
      if (!currentIds.has(id)) {
        notifiedIds.current.delete(id);
      }
    });
  }, [reminders]);

  return null; // This component doesn't render anything
}
