import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import { TimerAlertSettings } from "@/features/alerts/TimerAlertSettings";
import { BackgroundCustomizer } from "@/features/backgrounds/BackgroundCustomizer";
import { MusicSettings } from "@/features/music/MusicSettings";
import { useIsEmbeddedPreview } from "@/features/publishShare/useIsEmbeddedPreview";
import { TimerTabOrderSettings } from "@/features/timers/navigation/TimerTabOrderSettings";
import {
  AlertCircle,
  Bell,
  Check,
  CheckSquare,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Info,
  Maximize2,
  Minimize2,
  Music,
  Settings,
  Share2,
  Sparkles,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

function formatWallClock(date: Date): string {
  let hours = date.getHours() % 12;
  if (hours === 0) hours = 12;
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "PM" : "AM";
  return `${hours}:${minutes} ${ampm}`;
}

const TAB_TITLES: Record<string, { title: string; description: string }> = {
  background: {
    title: "Settings",
    description: "Customize your timer experience",
  },
  music: { title: "Settings", description: "Customize your timer experience" },
  alerts: { title: "Settings", description: "Customize your timer experience" },
  "timer-tabs": {
    title: "Settings",
    description: "Customize your timer experience",
  },
  share: { title: "Share", description: "Share your timer setup" },
};

interface TimerVisibilityBarProps {
  isVisible: boolean;
  onToggle: () => void;
  toggleA: boolean;
  onToggleA: () => void;
  toggleB: boolean;
  onToggleB: () => void;
  onResetTimerOrder: () => void;
  tasksVisible: boolean;
  onToggleTasks: () => void;
}

export function TimerVisibilityBar({
  isVisible,
  onToggle,
  toggleA,
  onToggleA,
  toggleB,
  onToggleB,
  onResetTimerOrder,
  tasksVisible,
  onToggleTasks,
}: TimerVisibilityBarProps) {
  const [now, setNow] = useState(() => new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("background");

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Track fullscreen state
  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleChange);
    document.addEventListener("webkitfullscreenchange", handleChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
      document.removeEventListener("webkitfullscreenchange", handleChange);
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!isFullscreen) {
      try {
        const el = document.documentElement;
        if (el.requestFullscreen) {
          await el.requestFullscreen();
        } else {
          const safariEl = el as HTMLElement & {
            webkitRequestFullscreen?: () => Promise<void>;
          };
          if (safariEl.webkitRequestFullscreen) {
            await safariEl.webkitRequestFullscreen();
          }
        }
      } catch {
        // Fullscreen may be denied in iframes
      }
    } else {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else {
          const doc = document as Document & {
            webkitExitFullscreen?: () => Promise<void>;
          };
          if (doc.webkitExitFullscreen) {
            await doc.webkitExitFullscreen();
          }
        }
      } catch {
        // Ignore
      }
    }
  }, [isFullscreen]);

  const openShareTab = () => {
    setActiveTab("share");
    setSettingsOpen(true);
  };

  // Pink/crimson theme classes matching the Settings panel aesthetic
  const toggleClass =
    "h-7 px-2.5 text-xs font-medium gap-1.5 bg-settings-pink text-settings-crimson border border-settings-pink " +
    "hover:bg-settings-pink-active hover:text-settings-crimson " +
    "data-[state=on]:bg-settings-pink-active data-[state=on]:text-settings-crimson data-[state=on]:border-settings-crimson/30";

  const btnClass =
    "h-7 px-2.5 text-xs font-medium gap-1.5 bg-settings-pink text-settings-crimson border border-settings-pink " +
    "hover:bg-settings-pink-active hover:text-settings-crimson";

  const currentTabMeta = TAB_TITLES[activeTab] ?? TAB_TITLES.background;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 bg-background border-t border-border"
      style={{
        height: "38px",
        boxShadow: "0 -2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex items-center h-full px-4">
        {/* LEFT: Wall clock */}
        <div
          className="flex items-center shrink-0"
          style={{ minWidth: "90px" }}
        >
          <span className="text-sm font-semibold tabular-nums tracking-wide select-none text-foreground">
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
            className={toggleClass}
            aria-label="Toggle timer visibility"
          >
            {isVisible ? (
              <EyeOff className="h-3.5 w-3.5" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}
            {isVisible ? "Hide Timer" : "Show Timer"}
          </Toggle>

          {/* Toggle A — Music */}
          <Toggle
            pressed={toggleA}
            onPressedChange={onToggleA}
            size="sm"
            className={toggleClass}
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
            className={toggleClass}
            aria-label="Toggle alerts"
          >
            <Bell className="h-3.5 w-3.5" />
            Alerts
          </Toggle>

          {/* Tasks toggle */}
          <Toggle
            pressed={tasksVisible}
            onPressedChange={onToggleTasks}
            size="sm"
            className={toggleClass}
            aria-label="Toggle tasks panel"
          >
            <CheckSquare className="h-3.5 w-3.5" />
            Tasks
          </Toggle>

          {/* Fullscreen toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className={btnClass}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            title={isFullscreen ? "Exit fullscreen (Esc)" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
            {isFullscreen ? "Exit Full" : "Fullscreen"}
          </Button>

          {/* Settings dialog (includes Share tab) */}
          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={btnClass}
                onClick={() => {
                  setActiveTab("background");
                  setSettingsOpen(true);
                }}
              >
                <Settings className="h-3.5 w-3.5" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent
              className="max-w-2xl w-full p-0 gap-0 overflow-hidden"
              style={{
                maxHeight: "min(85vh, 720px)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Fixed header — title updates based on active tab */}
              <div className="shrink-0 px-6 pt-6 pb-3 border-b bg-settings-pink">
                <DialogHeader>
                  <DialogTitle className="text-settings-crimson">
                    {currentTabMeta.title}
                  </DialogTitle>
                  <DialogDescription>
                    {currentTabMeta.description}
                  </DialogDescription>
                </DialogHeader>
              </div>

              {/* Tabs */}
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex flex-col min-h-0 flex-1"
              >
                {/* Sticky tab list */}
                <div className="shrink-0 px-6 pt-3 pb-0 bg-settings-pink">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="background">Background</TabsTrigger>
                    <TabsTrigger value="music">Music</TabsTrigger>
                    <TabsTrigger value="alerts">Alerts</TabsTrigger>
                    <TabsTrigger value="timer-tabs">Timer Tabs</TabsTrigger>
                    <TabsTrigger value="share">Share</TabsTrigger>
                  </TabsList>
                </div>

                {/* Scrollable content area — fills remaining height, pink background */}
                <div
                  className="flex-1 overflow-y-auto px-6 pb-6 pt-4 bg-settings-pink"
                  style={{ minHeight: 0 }}
                >
                  <TabsContent
                    value="background"
                    className="mt-0 space-y-4"
                    tabIndex={-1}
                  >
                    <BackgroundCustomizer />
                  </TabsContent>
                  <TabsContent
                    value="music"
                    className="mt-0 space-y-4"
                    tabIndex={-1}
                  >
                    <MusicSettings />
                  </TabsContent>
                  <TabsContent
                    value="alerts"
                    className="mt-0 space-y-4"
                    tabIndex={-1}
                  >
                    <TimerAlertSettings />
                  </TabsContent>
                  <TabsContent
                    value="timer-tabs"
                    className="mt-0 space-y-4"
                    tabIndex={-1}
                  >
                    <TimerTabOrderSettings onReset={onResetTimerOrder} />
                  </TabsContent>
                  <TabsContent value="share" className="mt-0" tabIndex={-1}>
                    <ShareTabContent />
                  </TabsContent>
                </div>
              </Tabs>
            </DialogContent>
          </Dialog>

          {/* Share shortcut button */}
          <Button
            variant="ghost"
            size="sm"
            className={btnClass}
            onClick={openShareTab}
            aria-label="Share"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>
        </div>

        {/* RIGHT SPACER to balance layout */}
        <div className="flex-1" />
      </div>
    </div>
  );
}

// Share tab content rendered inside the Settings dialog
function ShareTabContent() {
  const [copied, setCopied] = useState(false);
  const isEmbedded = useIsEmbeddedPreview();
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = currentUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand("copy");
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // ignore
        } finally {
          textArea.remove();
        }
      }
    } catch {
      // ignore
    }
  };

  const handleOpenInNewTab = () => {
    try {
      window.open(currentUrl, "_blank", "noopener,noreferrer");
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-5">
      {/* Embedded Preview Warning */}
      {isEmbedded && (
        <Alert
          variant="default"
          className="border-settings-crimson/30 bg-settings-pink-active"
        >
          <AlertCircle className="h-4 w-4 text-settings-crimson" />
          <AlertDescription className="text-sm text-settings-crimson">
            <strong>Preview Mode:</strong> You're viewing the editor preview.
            The URL below is temporary. To get a public URL, use the{" "}
            <strong>Live</strong> tab and click <strong>Go live</strong>.
          </AlertDescription>
        </Alert>
      )}

      {/* Current URL Display */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-settings-crimson">
          {isEmbedded ? "Preview URL (This Session)" : "Current URL"}
        </p>
        <div className="rounded-md border border-settings-crimson/20 bg-settings-pink-active px-3 py-2 text-sm break-all text-settings-crimson">
          {currentUrl}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleCopyLink}
          className="flex-1 bg-settings-crimson text-white hover:bg-settings-crimson-hover border-0"
        >
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </>
          )}
        </Button>
        <Button
          onClick={handleOpenInNewTab}
          className="flex-1 bg-settings-pink-active text-settings-crimson border border-settings-crimson/30 hover:bg-settings-pink"
          variant="outline"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Open in New Tab
        </Button>
      </div>

      {/* Get Public URL info */}
      <div className="rounded-lg border border-settings-crimson/20 bg-settings-pink-active p-4 space-y-3">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 text-settings-crimson mt-0.5 shrink-0" />
          <div className="space-y-2 text-sm">
            <p className="font-medium text-settings-crimson">
              Get Your Public URL
            </p>
            <p className="text-settings-crimson/70">
              To publish your app and get a permanent public URL:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-settings-crimson/70 ml-1">
              <li>
                Click the <strong>Live</strong> tab (top right of Caffeine)
              </li>
              <li>
                Click the <strong>Go live</strong> button
              </li>
              <li>Wait a few seconds for deployment</li>
              <li>Your public URL will appear at the top</li>
            </ol>
            <p className="text-xs text-settings-crimson/60 pt-1">
              The public URL will remain accessible even after you close the
              editor.
            </p>
          </div>
        </div>
      </div>

      {/* Publish to App Market */}
      <div className="rounded-lg border border-settings-crimson/20 bg-settings-pink-active p-4 space-y-3">
        <div className="flex items-start gap-2">
          <Sparkles className="h-5 w-5 text-settings-crimson mt-0.5 shrink-0" />
          <div className="space-y-2 text-sm">
            <p className="font-medium text-settings-crimson">
              Publish to the App Market
            </p>
            <p className="text-settings-crimson/70">
              Once your app is live, you can submit it to the Caffeine App
              Market:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-settings-crimson/70 ml-1">
              <li>
                Ensure your app is <strong>live</strong> with a public URL
              </li>
              <li>
                Navigate to the <strong>App Market</strong> in the Caffeine
                sidebar
              </li>
              <li>
                Click <strong>"Submit Your App"</strong>
              </li>
              <li>Fill in your app details and submit for review</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
