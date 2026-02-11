import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { useIntervalTimer } from './useIntervalTimer';
import { formatTime } from '../shared/timeFormat';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { EditableNumberInput } from '../shared/EditableNumberInput';
import { MinutesSecondsInput } from '../shared/MinutesSecondsInput';
import { useTimerAlerts } from '@/features/alerts/TimerAlertsProvider';

export function IntervalTimer() {
  const { notifyCompletion } = useTimerAlerts();
  const {
    timeLeft,
    isRunning,
    currentInterval,
    currentRound,
    totalRounds,
    settings,
    updateSettings,
    start,
    pause,
    reset,
    skip,
  } = useIntervalTimer({
    onCycleComplete: () => notifyCompletion('All interval rounds completed!'),
  });

  const progress = settings.intervalA > 0 && settings.intervalB > 0
    ? ((currentRound - 1) / totalRounds) * 100 + (1 / totalRounds) * 
      (currentInterval === 'A' 
        ? ((settings.intervalA - timeLeft) / settings.intervalA) * 100
        : ((settings.intervalB - timeLeft) / settings.intervalB) * 100)
    : 0;

  const handleIntervalAChange = (newValue: number) => {
    updateSettings({ intervalA: newValue });
  };

  const handleIntervalBChange = (newValue: number) => {
    updateSettings({ intervalB: newValue });
  };

  const handleRoundsChange = (newValue: number) => {
    updateSettings({ rounds: newValue });
  };

  return (
    <Card className="bg-card/80 backdrop-blur-xl border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Interval Timer</CardTitle>
            <CardDescription>Alternate between work and rest intervals</CardDescription>
          </div>
          <Badge variant={currentInterval === 'A' ? 'default' : 'secondary'}>
            Interval {currentInterval}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="timer-display text-7xl font-bold tracking-wider sm:text-8xl">
            {formatTime(timeLeft)}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Round {currentRound} of {totalRounds}
          </p>
          <Progress value={progress} className="mt-4 h-2" />
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

        <div className="grid gap-4 sm:grid-cols-3">
          <MinutesSecondsInput
            id="interval-a"
            label="Interval A"
            value={settings.intervalA}
            onChange={handleIntervalAChange}
            disabled={isRunning}
          />
          <MinutesSecondsInput
            id="interval-b"
            label="Interval B"
            value={settings.intervalB}
            onChange={handleIntervalBChange}
            disabled={isRunning}
          />
          <div className="space-y-2">
            <Label htmlFor="rounds">Rounds</Label>
            <EditableNumberInput
              id="rounds"
              value={settings.rounds}
              onChange={handleRoundsChange}
              min={1}
              max={50}
              disabled={isRunning}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
