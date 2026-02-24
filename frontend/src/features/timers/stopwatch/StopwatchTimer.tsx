import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { useStopwatch } from './useStopwatch';
import { formatMilliseconds } from '../shared/timeFormat';
import { ScrollArea } from '@/components/ui/scroll-area';

export function StopwatchTimer() {
  const { elapsed, isRunning, laps, start, pause, reset, recordLap } = useStopwatch();

  return (
    <Card className="w-full bg-white border-2 border-black shadow-none rounded-xl">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-base font-bold text-black">Stopwatch</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex flex-col items-center gap-4">
        {/* Time display */}
        <div className="flex flex-col items-center">
          <span className="text-5xl font-bold tabular-nums text-black tracking-wider">
            {formatMilliseconds(elapsed)}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={reset}
            className="border-2 border-black text-black hover:bg-black hover:text-white"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            onClick={isRunning ? pause : start}
            className="w-12 h-12 bg-black text-white hover:bg-black/80 border-2 border-black"
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          {isRunning && (
            <Button
              variant="outline"
              size="icon"
              onClick={recordLap}
              className="border-2 border-black text-black hover:bg-black hover:text-white"
            >
              <Flag className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Laps */}
        {laps.length > 0 && (
          <div className="w-full border-t-2 border-black pt-3">
            <p className="text-xs font-bold text-black mb-2 uppercase tracking-wide">Laps</p>
            <ScrollArea className="h-36 w-full rounded border-2 border-black">
              <div className="p-2 space-y-1">
                {laps.map((lapTime, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm px-2 py-1 border-b border-black/20 last:border-0"
                  >
                    <span className="text-black font-semibold">Lap {laps.length - index}</span>
                    <span className="text-black tabular-nums font-bold">
                      {formatMilliseconds(lapTime)}
                    </span>
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
