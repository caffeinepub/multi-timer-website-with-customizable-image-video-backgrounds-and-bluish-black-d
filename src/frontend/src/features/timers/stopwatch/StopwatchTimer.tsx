import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Flag, Pause, Play, RotateCcw } from "lucide-react";
import { formatMilliseconds } from "../shared/timeFormat";
import { useStopwatch } from "./useStopwatch";

export function StopwatchTimer() {
  const { elapsed, isRunning, laps, start, pause, reset, recordLap } =
    useStopwatch();

  return (
    <Card className="w-full bg-settings-pink border border-settings-crimson/40 shadow-none rounded-xl">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-base font-bold text-settings-crimson">
          Stopwatch
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex flex-col items-center gap-4">
        {/* Time display */}
        <div className="flex flex-col items-center">
          <span className="text-5xl font-bold tabular-nums text-settings-crimson tracking-wider">
            {formatMilliseconds(elapsed)}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={reset}
            className="border-2 border-settings-crimson text-settings-crimson bg-transparent hover:bg-settings-crimson hover:text-white"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            onClick={isRunning ? pause : start}
            className="w-12 h-12 bg-settings-crimson text-white hover:bg-settings-crimson-hover border-2 border-settings-crimson"
          >
            {isRunning ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </Button>
          {isRunning && (
            <Button
              variant="outline"
              size="icon"
              onClick={recordLap}
              className="border-2 border-settings-crimson text-settings-crimson bg-transparent hover:bg-settings-crimson hover:text-white"
            >
              <Flag className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Laps */}
        {laps.length > 0 && (
          <div className="w-full border-t border-settings-crimson/30 pt-3">
            <p className="text-xs font-bold text-settings-crimson mb-2 uppercase tracking-wide">
              Laps
            </p>
            <ScrollArea className="h-32 w-full rounded border border-settings-crimson/30">
              <div className="p-2 space-y-1">
                {laps.map((lap, lapNumber) => (
                  <div
                    key={`lap-${lap}`}
                    className="flex items-center justify-between px-2 py-1 rounded bg-settings-pink-active"
                  >
                    <span className="text-xs font-semibold text-settings-crimson">
                      Lap {lapNumber + 1}
                    </span>
                    <span className="text-xs tabular-nums text-settings-crimson">
                      {formatMilliseconds(lap)}
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
