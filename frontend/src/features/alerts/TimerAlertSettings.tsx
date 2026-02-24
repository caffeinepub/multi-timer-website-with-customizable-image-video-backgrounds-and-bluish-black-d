import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTimerAlerts } from './TimerAlertsProvider';
import { useCustomSounds } from '../sounds/CustomSoundsProvider';
import { ALERT_SOUNDS, type AlertSoundOption } from './alertSounds';
import { Volume2 } from 'lucide-react';

export function TimerAlertSettings() {
  const { alertsEnabled, setAlertsEnabled, completionSound, setCompletionSound, previewSound } = useTimerAlerts();
  const { sounds: customSounds } = useCustomSounds();

  const handlePreview = async () => {
    await previewSound(completionSound);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timer Alerts</CardTitle>
        <CardDescription>
          Get notified when timers and reminders complete
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="alerts-toggle" className="flex flex-col gap-1">
            <span>Enable completion alerts</span>
            <span className="text-sm font-normal text-muted-foreground">
              Show notification and play sound when timer finishes
            </span>
          </Label>
          <Switch
            id="alerts-toggle"
            checked={alertsEnabled}
            onCheckedChange={setAlertsEnabled}
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="sound-select" className="text-base">
            Completion sound
          </Label>
          <div className="flex gap-2">
            <Select
              value={completionSound}
              onValueChange={(value) => setCompletionSound(value as AlertSoundOption)}
            >
              <SelectTrigger id="sound-select" className="flex-1">
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
              disabled={completionSound === 'off'}
              title="Preview sound"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {completionSound === 'off' 
              ? 'No sound will play'
              : completionSound.startsWith('custom-')
              ? 'Custom sound will play when timer completes'
              : ALERT_SOUNDS.find(s => s.id === completionSound)?.description || 'Sound will play when timer completes'
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
