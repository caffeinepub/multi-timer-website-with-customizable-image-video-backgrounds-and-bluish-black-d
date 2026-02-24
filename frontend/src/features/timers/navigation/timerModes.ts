import { TimerMode } from '@/App';

export interface TimerModeDefinition {
  id: TimerMode;
  label: string;
}

export const TIMER_MODES: TimerModeDefinition[] = [
  { id: 'pomodoro', label: 'Pomodoro' },
  { id: 'stopwatch', label: 'Stopwatch' },
  { id: 'countdown', label: 'Countdown' },
  { id: 'interval', label: 'Interval' },
  { id: 'repeating', label: 'Repeating' },
  { id: 'reminders', label: 'Reminders' },
];

export const DEFAULT_TIMER_ORDER: TimerMode[] = TIMER_MODES.map(m => m.id);

export function getTimerModeLabel(id: TimerMode): string {
  return TIMER_MODES.find(m => m.id === id)?.label || id;
}
