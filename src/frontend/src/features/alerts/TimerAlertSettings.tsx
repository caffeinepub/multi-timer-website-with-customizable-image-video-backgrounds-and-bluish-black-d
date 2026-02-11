import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTimerAlerts } from './TimerAlertsProvider';

export function TimerAlertSettings() {
  const { alertsEnabled, setAlertsEnabled } = useTimerAlerts();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timer Alerts</CardTitle>
        <CardDescription>
          Get notified when timers complete
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
