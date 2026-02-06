import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { useStopwatch } from './useStopwatch';
import { formatMilliseconds } from '../shared/timeFormat';
import { ScrollArea } from '@/components/ui/scroll-area';

export function StopwatchTimer() {
  const { elapsed, isRunning, laps, start, pause, reset, recordLap } = useStopwatch();

  return (
    <Card className="bg-card/80 backdrop-blur-xl border-border/50">
      <CardHeader>
        <CardTitle>Stopwatch</CardTitle>
        <CardDescription>Track elapsed time and record laps</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="timer-display text-7xl font-bold tracking-wider sm:text-8xl">
            {formatMilliseconds(elapsed)}
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
          {isRunning && (
            <Button size="lg" variant="outline" onClick={recordLap}>
              <Flag className="mr-2 h-5 w-5" />
              Lap
            </Button>
          )}
          <Button size="lg" variant="outline" onClick={reset}>
            <RotateCcw className="mr-2 h-5 w-5" />
            Reset
          </Button>
        </div>

        {laps.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Laps</h3>
            <ScrollArea className="h-48 rounded-md border border-border bg-muted/30 p-4">
              <div className="space-y-2">
                {laps.map((lap, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-md bg-card/50 px-3 py-2 text-sm"
                  >
                    <span className="font-medium">Lap {laps.length - index}</span>
                    <span className="font-mono">{formatMilliseconds(lap)}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
