import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTimerAlerts } from "@/features/alerts/TimerAlertsProvider";
import { Infinity as InfinityIcon, Pause, Play, RotateCcw } from "lucide-react";
import { EditableNumberInput } from "../shared/EditableNumberInput";
import { formatTime } from "../shared/timeFormat";
import { useRepeatingTimer } from "./useRepeatingTimer";

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
    onComplete: () => notifyCompletion("All repeating timer cycles completed!"),
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
    <Card className="w-full bg-settings-pink border border-settings-crimson/40 shadow-none rounded-xl">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-base font-bold text-settings-crimson flex items-center justify-between">
          <span>Repeating</span>
          {settings.infinite && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-settings-crimson text-white font-semibold flex items-center gap-1">
              <InfinityIcon className="w-3 h-3" /> Infinite
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex flex-col items-center gap-4">
        {/* Time display */}
        <div className="flex flex-col items-center">
          <span className="text-5xl font-bold tabular-nums text-settings-crimson tracking-wider">
            {formatTime(timeLeft)}
          </span>
          <span className="text-xs text-settings-crimson/60 mt-1">
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
        </div>

        {/* Settings */}
        <div className="w-full border-t border-settings-crimson/30 pt-3 space-y-3">
          <p className="text-xs font-bold text-settings-crimson uppercase tracking-wide">
            Settings
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-settings-crimson">
                Minutes
              </Label>
              <EditableNumberInput
                value={minutes}
                min={0}
                max={59}
                onChange={handleMinutesChange}
                disabled={isRunning}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-settings-crimson">
                Seconds
              </Label>
              <EditableNumberInput
                value={seconds}
                min={0}
                max={59}
                onChange={handleSecondsChange}
                disabled={isRunning}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-settings-crimson/30 bg-settings-pink-active p-3">
            <div className="space-y-0.5">
              <Label className="text-xs font-semibold text-settings-crimson">
                Infinite Mode
              </Label>
              <p className="text-xs text-settings-crimson/60">
                Repeat indefinitely
              </p>
            </div>
            <Switch
              checked={settings.infinite}
              onCheckedChange={(checked) =>
                updateSettings({ infinite: checked })
              }
              disabled={isRunning}
            />
          </div>

          {!settings.infinite && (
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-settings-crimson">
                Repeat Count
              </Label>
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
