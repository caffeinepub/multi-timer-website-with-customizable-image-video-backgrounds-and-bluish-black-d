import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Volume2 } from "lucide-react";
import { useCustomSounds } from "../sounds/CustomSoundsProvider";
import { useTimerAlerts } from "./TimerAlertsProvider";
import { ALERT_SOUNDS, type AlertSoundOption } from "./alertSounds";

export function TimerAlertSettings() {
  const {
    alertsEnabled,
    setAlertsEnabled,
    completionSound,
    setCompletionSound,
    previewSound,
  } = useTimerAlerts();
  const { sounds: customSounds } = useCustomSounds();

  const handlePreview = async () => {
    await previewSound(completionSound);
  };

  return (
    <div className="space-y-6 rounded-lg border border-settings-crimson/30 bg-settings-pink-active p-5">
      {/* Header */}
      <div>
        <h3 className="text-base font-semibold text-settings-crimson">
          Timer Alerts
        </h3>
        <p className="text-sm text-settings-crimson/70 mt-0.5">
          Get notified when timers and reminders complete
        </p>
      </div>

      {/* Enable toggle */}
      <div className="flex items-center justify-between">
        <Label
          htmlFor="alerts-toggle"
          className="flex flex-col gap-1 cursor-pointer"
        >
          <span className="text-settings-crimson font-medium">
            Enable completion alerts
          </span>
          <span className="text-sm font-normal text-settings-crimson/70">
            Show notification and play sound when timer finishes
          </span>
        </Label>
        <Switch
          id="alerts-toggle"
          checked={alertsEnabled}
          onCheckedChange={setAlertsEnabled}
        />
      </div>

      {/* Sound selector */}
      <div className="space-y-3">
        <Label
          htmlFor="sound-select"
          className="text-base text-settings-crimson font-medium"
        >
          Completion sound
        </Label>
        <div className="flex gap-2">
          <Select
            value={completionSound}
            onValueChange={(value) =>
              setCompletionSound(value as AlertSoundOption)
            }
          >
            <SelectTrigger
              id="sound-select"
              className="flex-1 border-settings-crimson/30 text-settings-crimson"
            >
              <SelectValue placeholder="Select a sound" />
            </SelectTrigger>
            <SelectContent>
              {ALERT_SOUNDS.map((sound) => (
                <SelectItem key={sound.id} value={sound.id}>
                  {sound.label}
                </SelectItem>
              ))}
              {customSounds.length > 0 && (
                <>
                  <Separator className="my-2" />
                  {customSounds.map((sound) => (
                    <SelectItem key={sound.id} value={sound.id}>
                      {sound.name} (Custom)
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreview}
            disabled={completionSound === "off"}
            title="Preview sound"
            className="border-settings-crimson/30 text-settings-crimson hover:bg-settings-pink hover:text-settings-crimson"
          >
            <Volume2 className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-settings-crimson/70">
          {completionSound === "off"
            ? "No sound will play"
            : completionSound.startsWith("custom-")
              ? "Custom sound will play when timer completes"
              : ALERT_SOUNDS.find((s) => s.id === completionSound)
                  ?.description || "Sound will play when timer completes"}
        </p>
      </div>
    </div>
  );
}
