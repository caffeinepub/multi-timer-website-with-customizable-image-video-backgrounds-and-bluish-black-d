import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, Infinity } from 'lucide-react';
import { useRepeatingTimer } from './useRepeatingTimer';
import { formatTime } from '../shared/timeFormat';
import { Switch } from '@/components/ui/switch';
import { EditableNumberInput } from '../shared/EditableNumberInput';
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

  return (
    <Card className="w-full bg-white border-2 border-black shadow-none rounded-xl">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-base font-bold text-black flex items-center justify-between">
          <span>Repeating</span>
          {settings.infinite && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-black text-white font-semibold flex items-center gap-1">
              <Infinity className="w-3 h-3" /> Infinite
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex flex-col items-center gap-4">
        {/* Time display */}
        <div className="flex flex-col items-center">
          <span className="text-5xl font-bold tabular-nums text-black tracking-wider">
            {formatTime(timeLeft)}
          </span>
          <span className="text-xs text-black/60 mt-1">
            Completed: {completedRepeats}
            {!settings.infinite && ` / ${settings.repeatCount}`}
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
        </div>

        {/* Settings */}
        <div className="w-full border-t-2 border-black pt-3 space-y-3">
          <p className="text-xs font-bold text-black uppercase tracking-wide">Settings</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-black">Minutes</Label>
              <EditableNumberInput
                value={minutes}
                min={0}
                max={59}
                onChange={handleMinutesChange}
                disabled={isRunning}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-black">Seconds</Label>
              <EditableNumberInput
                value={seconds}
                min={0}
                max={59}
                onChange={handleSecondsChange}
                disabled={isRunning}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border-2 border-black p-3">
            <div className="space-y-0.5">
              <Label className="text-xs font-semibold text-black">Infinite Mode</Label>
              <p className="text-xs text-black/60">Repeat indefinitely</p>
            </div>
            <Switch
              checked={settings.infinite}
              onCheckedChange={(checked) => updateSettings({ infinite: checked })}
              disabled={isRunning}
            />
          </div>

          {!settings.infinite && (
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-black">Repeat Count</Label>
              <EditableNumberInput
                value={settings.repeatCount}
                min={1}
                max={100}
                onChange={(v) => updateSettings({ repeatCount: v })}
                disabled={isRunning}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
