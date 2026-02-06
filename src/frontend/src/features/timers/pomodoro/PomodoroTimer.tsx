import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { usePomodoro } from './usePomodoro';
import { formatTime } from '../shared/timeFormat';
import { Badge } from '@/components/ui/badge';

export function PomodoroTimer() {
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
  } = usePomodoro();

  const segmentLabels = {
    work: 'Work',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
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
            <Input
              id="work-duration"
              type="number"
              min="1"
              max="60"
              value={settings.workDuration}
              onChange={(e) => updateSettings({ workDuration: parseInt(e.target.value) || 25 })}
              disabled={isRunning}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="short-break">Short Break (min)</Label>
            <Input
              id="short-break"
              type="number"
              min="1"
              max="30"
              value={settings.shortBreakDuration}
              onChange={(e) => updateSettings({ shortBreakDuration: parseInt(e.target.value) || 5 })}
              disabled={isRunning}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="long-break">Long Break (min)</Label>
            <Input
              id="long-break"
              type="number"
              min="1"
              max="60"
              value={settings.longBreakDuration}
              onChange={(e) => updateSettings({ longBreakDuration: parseInt(e.target.value) || 15 })}
              disabled={isRunning}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="long-break-interval">Long Break After</Label>
            <Input
              id="long-break-interval"
              type="number"
              min="1"
              max="10"
              value={settings.longBreakInterval}
              onChange={(e) => updateSettings({ longBreakInterval: parseInt(e.target.value) || 4 })}
              disabled={isRunning}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
