import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useCountdown } from './useCountdown';
import { formatTime } from '../shared/timeFormat';
import { EditableNumberInput } from '../shared/EditableNumberInput';
import { RotaryDial } from '../shared/RotaryDial';

export function CountdownTimer() {
  const { timeLeft, isRunning, duration, setDuration, start, pause, reset } = useCountdown();

  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  const handleHoursChange = (newHours: number) => {
    setDuration(newHours * 3600 + minutes * 60 + seconds);
  };

  const handleMinutesChange = (newMinutes: number) => {
    setDuration(hours * 3600 + newMinutes * 60 + seconds);
  };

  const handleSecondsChange = (newSeconds: number) => {
    setDuration(hours * 3600 + minutes * 60 + newSeconds);
  };

  return (
    <Card className="bg-card/80 backdrop-blur-xl border-border/50">
      <CardHeader>
        <CardTitle>Countdown Timer</CardTitle>
        <CardDescription>Set a target time and count down</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="timer-display text-7xl font-bold tracking-wider sm:text-8xl">
            {formatTime(timeLeft)}
          </div>
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

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="hours">Hours</Label>
            <EditableNumberInput
              id="hours"
              value={hours}
              onChange={handleHoursChange}
              min={0}
              max={23}
              disabled={isRunning}
            />
          </div>
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
