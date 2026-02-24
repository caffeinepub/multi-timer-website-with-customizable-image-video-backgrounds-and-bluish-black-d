import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { usePomodoro } from './usePomodoro';
import { formatTime } from '../shared/timeFormat';
import { EditableNumberInput } from '../shared/EditableNumberInput';
import { useTimerAlerts } from '@/features/alerts/TimerAlertsProvider';

export function PomodoroTimer() {
  const { notifyCompletion } = useTimerAlerts();
  const {
    timeLeft,
    isRunning,
    currentSegment,
    completedPomodoros,
    settings,
    updateSettings,
    start,
    pause,
    reset,
    skip,
  } = usePomodoro({
    onSegmentComplete: (segment) => {
      const messages = {
        work: 'Work session completed! Time for a break.',
        shortBreak: 'Short break completed! Ready to work?',
        longBreak: 'Long break completed! Ready to work?',
      };
      notifyCompletion(messages[segment]);
    },
  });

  const segmentLabels = {
    work: 'Work',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
  };

  return (
    <Card className="w-full bg-white border-2 border-black shadow-none rounded-xl">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-base font-bold text-black flex items-center justify-between">
          <span>Pomodoro</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-black text-white font-semibold">
            {segmentLabels[currentSegment]}
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
            Completed: {completedPomodoros} pomodoro{completedPomodoros !== 1 ? 's' : ''}
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
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-black">Work (min)</Label>
              <EditableNumberInput
                value={settings.workDuration}
                min={1}
                max={120}
                onChange={(v) => updateSettings({ workDuration: v })}
                disabled={isRunning}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-black">Short Break (min)</Label>
              <EditableNumberInput
                value={settings.shortBreakDuration}
                min={1}
                max={60}
                onChange={(v) => updateSettings({ shortBreakDuration: v })}
                disabled={isRunning}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-black">Long Break (min)</Label>
              <EditableNumberInput
                value={settings.longBreakDuration}
                min={1}
                max={60}
                onChange={(v) => updateSettings({ longBreakDuration: v })}
                disabled={isRunning}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-black">Long Break After</Label>
              <EditableNumberInput
                value={settings.longBreakInterval}
                min={1}
                max={10}
                onChange={(v) => updateSettings({ longBreakInterval: v })}
                disabled={isRunning}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
