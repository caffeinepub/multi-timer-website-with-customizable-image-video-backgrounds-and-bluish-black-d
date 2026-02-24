import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { useIntervalTimer } from './useIntervalTimer';
import { formatTime } from '../shared/timeFormat';
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

  return (
    <Card className="w-full bg-white border-2 border-black shadow-none rounded-xl">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-base font-bold text-black flex items-center justify-between">
          <span>Interval</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-black text-white font-semibold">
            Interval {currentInterval} · Round {currentRound}/{totalRounds}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex flex-col items-center gap-4">
        {/* Time display */}
        <div className="flex flex-col items-center">
          <span className="text-5xl font-bold tabular-nums text-black tracking-wider">
            {formatTime(timeLeft)}
          </span>
          <span className="text-xs text-black/60 mt-1">
            {currentInterval === 'A' ? 'Work' : 'Rest'}
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
          <Button
            variant="outline"
            size="icon"
            onClick={skip}
            className="border-2 border-black text-black hover:bg-black hover:text-white"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Settings */}
        <div className="w-full border-t-2 border-black pt-3">
          <p className="text-xs font-bold text-black mb-3 uppercase tracking-wide">Settings</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-black">Interval A (sec)</Label>
              <EditableNumberInput
                value={settings.intervalA}
                min={1}
                max={3600}
                onChange={(v) => updateSettings({ intervalA: v })}
                disabled={isRunning}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-black">Interval B (sec)</Label>
              <EditableNumberInput
                value={settings.intervalB}
                min={1}
                max={3600}
                onChange={(v) => updateSettings({ intervalB: v })}
                disabled={isRunning}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-black">Rounds</Label>
              <EditableNumberInput
                value={settings.rounds}
                min={1}
                max={50}
                onChange={(v) => updateSettings({ rounds: v })}
                disabled={isRunning}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
