import { useEffect, useRef } from "react";
import { useTimerAlerts } from "../alerts/TimerAlertsProvider";
import { useReminders } from "./useReminders";

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

      for (const reminder of reminders) {
        // Skip if already notified
        if (notifiedIds.current.has(reminder.id)) {
          continue;
        }

        const dueDate = new Date(reminder.dueDate);

        // Check if reminder is due (within 1 minute tolerance)
        if (dueDate <= now) {
          notifiedIds.current.add(reminder.id);
          notifyCompletion(`Reminder: ${reminder.title}`);
        }
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(checkInterval);
  }, [reminders, notifyCompletion, alertsEnabled]);

  // Clean up notified IDs when reminders are deleted
  useEffect(() => {
    const currentIds = new Set(reminders.map((r) => r.id));
    for (const id of notifiedIds.current) {
      if (!currentIds.has(id)) {
        notifiedIds.current.delete(id);
      }
    }
  }, [reminders]);

  return null; // This component doesn't render anything
}
