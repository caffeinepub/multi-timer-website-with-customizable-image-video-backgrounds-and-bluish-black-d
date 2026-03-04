import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTimerAlerts } from "@/features/alerts/TimerAlertsProvider";
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { EditableNumberInput } from "../shared/EditableNumberInput";
import { formatTime } from "../shared/timeFormat";
import { usePomodoro } from "./usePomodoro";

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
        work: "Work session completed! Time for a break.",
        shortBreak: "Short break completed! Ready to work?",
        longBreak: "Long break completed! Ready to work?",
      };
      notifyCompletion(messages[segment]);
    },
  });

  const segmentLabels = {
    work: "Work",
    shortBreak: "Short Break",
    longBreak: "Long Break",
  };

  return (
    <Card className="w-full bg-settings-pink border border-settings-crimson/40 shadow-none rounded-xl">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-base font-bold text-settings-crimson flex items-center justify-between">
          <span>Pomodoro</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-settings-crimson text-white font-semibold">
            {segmentLabels[currentSegment]}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex flex-col items-center gap-4">
        {/* Time display */}
        <div className="flex flex-col items-center">
          <span className="text-5xl font-bold tabular-nums text-settings-crimson tracking-wider">
            {formatTime(timeLeft)}
          </span>
          <span className="text-xs text-settings-crimson/60 mt-1">
            Completed: {completedPomodoros} pomodoro
            {completedPomodoros !== 1 ? "s" : ""}
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
          <Button
            variant="outline"
            size="icon"
            onClick={skip}
            className="border-2 border-settings-crimson text-settings-crimson bg-transparent hover:bg-settings-crimson hover:text-white"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Settings */}
        <div className="w-full border-t border-settings-crimson/30 pt-3">
          <p className="text-xs font-bold text-settings-crimson mb-3 uppercase tracking-wide">
            Settings
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-settings-crimson">
                Work (min)
              </Label>
              <EditableNumberInput
                value={settings.workDuration}
                min={1}
                max={120}
                onChange={(v) => updateSettings({ workDuration: v })}
                disabled={isRunning}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-settings-crimson">
                Short Break (min)
              </Label>
              <EditableNumberInput
                value={settings.shortBreakDuration}
                min={1}
                max={60}
                onChange={(v) => updateSettings({ shortBreakDuration: v })}
                disabled={isRunning}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-settings-crimson">
                Long Break (min)
              </Label>
              <EditableNumberInput
                value={settings.longBreakDuration}
                min={1}
                max={60}
                onChange={(v) => updateSettings({ longBreakDuration: v })}
                disabled={isRunning}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-settings-crimson">
                Long Break After
              </Label>
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
