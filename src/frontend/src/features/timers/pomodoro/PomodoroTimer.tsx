import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { usePomodoro } from './usePomodoro';
import { formatTime } from '../shared/timeFormat';
import { Badge } from '@/components/ui/badge';
import { EditableNumberInput } from '../shared/EditableNumberInput';
import { RotaryDial } from '../shared/RotaryDial';
import { useTimerAlerts } from '@/features/alerts/TimerAlertsProvider';

export function PomodoroTimer() {
  const { notifyCompletion } = useTimerAlerts();
  const {
    timeLeft,
    isRunning,
    currentSegment,
    completedPomodoros,
    settings,
    updateSettings,
    start,
    pause,
    reset,
    skip,
  } = usePomodoro({
    onSegmentComplete: (segment) => {
      const messages = {
        work: 'Work session completed! Time for a break.',
        shortBreak: 'Short break completed! Ready to work?',
        longBreak: 'Long break completed! Ready to work?',
      };
      notifyCompletion(messages[segment]);
    },
  });

  const segmentLabels = {
    work: 'Work',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
  };

  const handleWorkDurationChange = (newValue: number) => {
    updateSettings({ workDuration: newValue });
  };

  const handleShortBreakChange = (newValue: number) => {
    updateSettings({ shortBreakDuration: newValue });
  };

  const handleLongBreakChange = (newValue: number) => {
    updateSettings({ longBreakDuration: newValue });
  };

  const handleLongBreakIntervalChange = (newValue: number) => {
    updateSettings({ longBreakInterval: newValue });
  };

  return (
    <Card className="bg-card/80 backdrop-blur-xl border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Pomodoro Timer</CardTitle>
            <CardDescription>Focus with the Pomodoro Technique</CardDescription>
          </div>
          <Badge variant={currentSegment === 'work' ? 'default' : 'secondary'}>
            {segmentLabels[currentSegment]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="timer-display text-7xl font-bold tracking-wider sm:text-8xl">
            {formatTime(timeLeft)}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Completed: {completedPomodoros} pomodoro{completedPomodoros !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex justify-center gap-2">
          {!isRunning ? (
            <Button size="lg" onClick={start} className="min-w-32">
              <Play className="mr-2 h-5 w-5" />
              Start
            </Button>
          ) : (
            <Button size="lg" onClick={pause} variant="secondary" className="min-w-32">
              <Pause className="mr-2 h-5 w-5" />
              Pause
            </Button>
          )}
          <Button size="lg" variant="outline" onClick={skip}>
            <SkipForward className="mr-2 h-5 w-5" />
            Skip
          </Button>
          <Button size="lg" variant="outline" onClick={reset}>
            <RotateCcw className="mr-2 h-5 w-5" />
            Reset
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="work-duration">Work Duration (min)</Label>
            <EditableNumberInput
              id="work-duration"
              value={settings.workDuration}
              onChange={handleWorkDurationChange}
              min={1}
              max={60}
              disabled={isRunning}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="short-break">Short Break (min)</Label>
            <EditableNumberInput
              id="short-break"
              value={settings.shortBreakDuration}
              onChange={handleShortBreakChange}
              min={1}
              max={30}
              disabled={isRunning}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="long-break">Long Break (min)</Label>
            <EditableNumberInput
              id="long-break"
              value={settings.longBreakDuration}
              onChange={handleLongBreakChange}
              min={1}
              max={60}
              disabled={isRunning}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="long-break-interval">Long Break After</Label>
            <EditableNumberInput
              id="long-break-interval"
              value={settings.longBreakInterval}
              onChange={handleLongBreakIntervalChange}
              min={1}
              max={10}
              disabled={isRunning}
            />
          </div>
        </div>

        <div className="flex justify-center gap-8 pt-4">
          <RotaryDial
            value={settings.workDuration}
            onChange={handleWorkDurationChange}
            min={1}
            max={60}
            disabled={isRunning}
            label="Work (min)"
          />
          <RotaryDial
            value={settings.shortBreakDuration}
            onChange={handleShortBreakChange}
            min={1}
            max={30}
            disabled={isRunning}
            label="Short Break (min)"
          />
        </div>
      </CardContent>
    </Card>
  );
}
