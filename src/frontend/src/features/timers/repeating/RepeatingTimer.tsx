import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, Infinity } from 'lucide-react';
import { useRepeatingTimer } from './useRepeatingTimer';
import { formatTime } from '../shared/timeFormat';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

export function RepeatingTimer() {
  const {
    timeLeft,
    isRunning,
    completedRepeats,
    settings,
    updateSettings,
    start,
    pause,
    reset,
  } = useRepeatingTimer();

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
            {settings.infinite
              ? `Completed: ${completedRepeats} repeat${completedRepeats !== 1 ? 's' : ''}`
              : `Repeat ${completedRepeats + 1} of ${settings.repeatCount}`}
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

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="rep-minutes">Minutes</Label>
              <Input
                id="rep-minutes"
                type="number"
                min="0"
                max="59"
                value={Math.floor(settings.duration / 60)}
                onChange={(e) => {
                  const minutes = parseInt(e.target.value) || 0;
                  const seconds = settings.duration % 60;
                  updateSettings({ duration: minutes * 60 + seconds });
                }}
                disabled={isRunning}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rep-seconds">Seconds</Label>
              <Input
                id="rep-seconds"
                type="number"
                min="0"
                max="59"
                value={settings.duration % 60}
                onChange={(e) => {
                  const minutes = Math.floor(settings.duration / 60);
                  const seconds = parseInt(e.target.value) || 0;
                  updateSettings({ duration: minutes * 60 + seconds });
                }}
                disabled={isRunning}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="repeat-count">Repeat Count</Label>
              <Input
                id="repeat-count"
                type="number"
                min="1"
                max="100"
                value={settings.repeatCount}
                onChange={(e) => updateSettings({ repeatCount: parseInt(e.target.value) || 1 })}
                disabled={isRunning || settings.infinite}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="infinite-mode"
              checked={settings.infinite}
              onCheckedChange={(checked) => updateSettings({ infinite: checked })}
              disabled={isRunning}
            />
            <Label htmlFor="infinite-mode" className="cursor-pointer">
              Infinite repeats
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
