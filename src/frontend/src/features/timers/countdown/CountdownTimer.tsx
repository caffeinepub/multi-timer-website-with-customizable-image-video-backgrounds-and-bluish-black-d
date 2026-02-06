import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useCountdown } from './useCountdown';
import { formatTime } from '../shared/timeFormat';

export function CountdownTimer() {
  const { timeLeft, isRunning, duration, setDuration, start, pause, reset } = useCountdown();

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
            <Input
              id="hours"
              type="number"
              min="0"
              max="23"
              value={Math.floor(duration / 3600)}
              onChange={(e) => {
                const hours = parseInt(e.target.value) || 0;
                const minutes = Math.floor((duration % 3600) / 60);
                const seconds = duration % 60;
                setDuration(hours * 3600 + minutes * 60 + seconds);
              }}
              disabled={isRunning}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minutes">Minutes</Label>
            <Input
              id="minutes"
              type="number"
              min="0"
              max="59"
              value={Math.floor((duration % 3600) / 60)}
              onChange={(e) => {
                const hours = Math.floor(duration / 3600);
                const minutes = parseInt(e.target.value) || 0;
                const seconds = duration % 60;
                setDuration(hours * 3600 + minutes * 60 + seconds);
              }}
              disabled={isRunning}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seconds">Seconds</Label>
            <Input
              id="seconds"
              type="number"
              min="0"
              max="59"
              value={duration % 60}
              onChange={(e) => {
                const hours = Math.floor(duration / 3600);
                const minutes = Math.floor((duration % 3600) / 60);
                const seconds = parseInt(e.target.value) || 0;
                setDuration(hours * 3600 + minutes * 60 + seconds);
              }}
              disabled={isRunning}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
