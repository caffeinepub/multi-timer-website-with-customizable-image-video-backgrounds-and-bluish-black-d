import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Eye, EyeOff, Settings, Share2, Music, Bell } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BackgroundCustomizer } from '@/features/backgrounds/BackgroundCustomizer';
import { MusicSettings } from '@/features/music/MusicSettings';
import { TimerAlertSettings } from '@/features/alerts/TimerAlertSettings';
import { TimerTabOrderSettings } from '@/features/timers/navigation/TimerTabOrderSettings';
import { PublishShareSheet } from '@/features/publishShare/PublishShareSheet';

function formatWallClock(date: Date): string {
  let hours = date.getHours() % 12;
  if (hours === 0) hours = 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
  return `${hours}:${minutes} ${ampm}`;
}

interface TimerVisibilityBarProps {
  isVisible: boolean;
  onToggle: () => void;
  toggleA: boolean;
  onToggleA: () => void;
  toggleB: boolean;
  onToggleB: () => void;
  onResetTimerOrder: () => void;
}

export function TimerVisibilityBar({
  isVisible,
  onToggle,
  toggleA,
  onToggleA,
  toggleB,
  onToggleB,
  onResetTimerOrder,
}: TimerVisibilityBarProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30"
      style={{
        height: '38px',
        background: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(255,255,255,0.10)',
      }}
    >
      <div className="flex items-center h-full px-4">
        {/* LEFT: Wall clock */}
        <div className="flex items-center shrink-0" style={{ minWidth: '90px' }}>
          <span
            className="text-sm font-semibold tabular-nums tracking-wide select-none"
            style={{ color: 'rgba(255,255,255,0.90)' }}
          >
            {formatWallClock(now)}
          </span>
        </div>

        {/* SPACER */}
        <div className="flex-1" />

        {/* CENTER: Controls */}
        <div className="flex items-center gap-1">
          {/* Show/Hide Timer toggle */}
          <Toggle
            pressed={isVisible}
            onPressedChange={onToggle}
            size="sm"
            className="h-7 px-2.5 text-xs font-medium gap-1.5 data-[state=on]:bg-white/20 data-[state=on]:text-white text-white/70 hover:text-white hover:bg-white/10"
            aria-label="Toggle timer visibility"
          >
            {isVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {isVisible ? 'Hide Timer' : 'Show Timer'}
          </Toggle>

          {/* Toggle A — Music */}
          <Toggle
            pressed={toggleA}
            onPressedChange={onToggleA}
            size="sm"
            className="h-7 px-2.5 text-xs font-medium gap-1.5 data-[state=on]:bg-white/20 data-[state=on]:text-white text-white/70 hover:text-white hover:bg-white/10"
            aria-label="Toggle music"
          >
            <Music className="h-3.5 w-3.5" />
            Music
          </Toggle>

          {/* Toggle B — Alerts */}
          <Toggle
            pressed={toggleB}
            onPressedChange={onToggleB}
            size="sm"
            className="h-7 px-2.5 text-xs font-medium gap-1.5 data-[state=on]:bg-white/20 data-[state=on]:text-white text-white/70 hover:text-white hover:bg-white/10"
            aria-label="Toggle alerts"
          >
            <Bell className="h-3.5 w-3.5" />
            Alerts
          </Toggle>

          {/* Settings dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2.5 text-xs font-medium gap-1.5 text-white/70 hover:text-white hover:bg-white/10"
              >
                <Settings className="h-3.5 w-3.5" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
                <DialogDescription>Customize your timer experience</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="background" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="background">Background</TabsTrigger>
                  <TabsTrigger value="music">Music</TabsTrigger>
                  <TabsTrigger value="alerts">Alerts</TabsTrigger>
                  <TabsTrigger value="timer-tabs">Timer Tabs</TabsTrigger>
                </TabsList>
                <TabsContent value="background" className="space-y-4">
                  <BackgroundCustomizer />
                </TabsContent>
                <TabsContent value="music" className="space-y-4">
                  <MusicSettings />
                </TabsContent>
                <TabsContent value="alerts" className="space-y-4">
                  <TimerAlertSettings />
                </TabsContent>
                <TabsContent value="timer-tabs" className="space-y-4">
                  <TimerTabOrderSettings onReset={onResetTimerOrder} />
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>

          {/* Share sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2.5 text-xs font-medium gap-1.5 text-white/70 hover:text-white hover:bg-white/10"
              >
                <Share2 className="h-3.5 w-3.5" />
                Share
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Publish & Share</SheetTitle>
                <SheetDescription>Share your timer app with others</SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <PublishShareSheetContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* RIGHT SPACER to balance layout */}
        <div className="flex-1" />
      </div>
    </div>
  );
}

// Inline share content (reuses logic from PublishShareSheet without the outer Sheet wrapper)
function PublishShareSheetContent() {
  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(currentUrl);
      } else {
        const ta = document.createElement('textarea');
        ta.value = currentUrl;
        ta.style.position = 'fixed';
        ta.style.left = '-999999px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Current URL</label>
        <div className="rounded-md border bg-muted/50 px-3 py-2 text-sm break-all">{currentUrl}</div>
      </div>
      <Button onClick={handleCopy} className="w-full" variant="default">
        {copied ? 'Copied!' : 'Copy Link'}
      </Button>
      <Button onClick={() => window.open(currentUrl, '_blank', 'noopener,noreferrer')} className="w-full" variant="outline">
        Open in New Tab
      </Button>
    </div>
  );
}
