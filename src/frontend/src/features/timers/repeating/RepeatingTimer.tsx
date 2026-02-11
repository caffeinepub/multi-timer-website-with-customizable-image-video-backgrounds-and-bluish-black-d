import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, Infinity } from 'lucide-react';
import { useRepeatingTimer } from './useRepeatingTimer';
import { formatTime } from '../shared/timeFormat';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { EditableNumberInput } from '../shared/EditableNumberInput';
import { RotaryDial } from '../shared/RotaryDial';
import { useTimerAlerts } from '@/features/alerts/TimerAlertsProvider';

export function RepeatingTimer() {
  const { notifyCompletion } = useTimerAlerts();
  const {
    timeLeft,
    isRunning,
    completedRepeats,
    settings,
    updateSettings,
    start,
    pause,
    reset,
  } = useRepeatingTimer({
    onComplete: () => notifyCompletion('All repeating timer cycles completed!'),
  });

  const minutes = Math.floor(settings.duration / 60);
  const seconds = settings.duration % 60;

  const handleMinutesChange = (newMinutes: number) => {
    updateSettings({ duration: newMinutes * 60 + seconds });
  };

  const handleSecondsChange = (newSeconds: number) => {
    updateSettings({ duration: minutes * 60 + newSeconds });
  };

  const handleRepeatCountChange = (newCount: number) => {
    updateSettings({ repeatCount: newCount });
  };

  return (
    <Card className="bg-card/80 backdrop-blur-xl border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Repeating Timer</CardTitle>
            <CardDescription>Auto-restart countdown timer</CardDescription>
          </div>
          {settings.infinite && (
            <Badge variant="secondary">
              <Infinity className="mr-1 h-3 w-3" />
              Infinite
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="timer-display text-7xl font-bold tracking-wider sm:text-8xl">
            {formatTime(timeLeft)}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Completed: {completedRepeats}
            {!settings.infinite && ` / ${settings.repeatCount}`}
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
          <Button size="lg" variant="outline" onClick={reset}>
            <RotateCcw className="mr-2 h-5 w-5" />
            Reset
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="minutes">Minutes</Label>
            <EditableNumberInput
              id="minutes"
              value={minutes}
              onChange={handleMinutesChange}
              min={0}
              max={59}
              disabled={isRunning}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seconds">Seconds</Label>
            <EditableNumberInput
              id="seconds"
              value={seconds}
              onChange={handleSecondsChange}
              min={0}
              max={59}
              disabled={isRunning}
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="infinite-mode">Infinite Mode</Label>
            <p className="text-sm text-muted-foreground">
              Timer will repeat indefinitely
            </p>
          </div>
          <Switch
            id="infinite-mode"
            checked={settings.infinite}
            onCheckedChange={(checked) => updateSettings({ infinite: checked })}
            disabled={isRunning}
          />
        </div>

        {!settings.infinite && (
          <div className="space-y-2">
            <Label htmlFor="repeat-count">Repeat Count</Label>
            <EditableNumberInput
              id="repeat-count"
              value={settings.repeatCount}
              onChange={handleRepeatCountChange}
              min={1}
              max={100}
              disabled={isRunning}
            />
          </div>
        )}

        <div className="flex justify-center gap-8 pt-4">
          <RotaryDial
            value={Math.max(1, minutes)}
            onChange={handleMinutesChange}
            min={1}
            max={60}
            disabled={isRunning}
            label="Minutes"
          />
          <RotaryDial
            value={Math.max(1, seconds)}
            onChange={handleSecondsChange}
            min={1}
            max={60}
            disabled={isRunning}
            label="Seconds"
          />
        </div>
      </CardContent>
    </Card>
  );
}
