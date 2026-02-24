import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useCountdown } from './useCountdown';
import { formatTime } from '../shared/timeFormat';
import { EditableNumberInput } from '../shared/EditableNumberInput';
import { useTimerAlerts } from '@/features/alerts/TimerAlertsProvider';

export function CountdownTimer() {
  const { notifyCompletion } = useTimerAlerts();
  const { timeLeft, isRunning, duration, setDuration, start, pause, reset } = useCountdown({
    onComplete: () => notifyCompletion('Countdown timer completed!'),
  });

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
    <Card className="w-full bg-white border-2 border-black shadow-none rounded-xl">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-base font-bold text-black">Countdown</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex flex-col items-center gap-4">
        {/* Time display */}
        <div className="flex flex-col items-center">
          <span className="text-5xl font-bold tabular-nums text-black tracking-wider">
            {formatTime(timeLeft)}
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

        {/* Duration settings */}
        <div className="w-full border-t-2 border-black pt-3">
          <p className="text-xs font-bold text-black mb-3 uppercase tracking-wide">Duration</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-black">Hours</Label>
              <EditableNumberInput
                value={hours}
                min={0}
                max={23}
                onChange={handleHoursChange}
                disabled={isRunning}
              />
            </div>
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
        </div>
      </CardContent>
    </Card>
  );
}
