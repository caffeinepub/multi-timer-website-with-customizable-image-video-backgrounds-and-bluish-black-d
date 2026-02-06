import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BackgroundProvider, useBackgroundContext } from '@/features/backgrounds/BackgroundProvider';
import { BackgroundStage } from '@/features/backgrounds/BackgroundStage';
import { BackgroundCustomizer } from '@/features/backgrounds/BackgroundCustomizer';
import { MusicProvider } from '@/features/music/MusicProvider';
import { MusicStage } from '@/features/music/MusicStage';
import { MusicSettings } from '@/features/music/MusicSettings';
import { PomodoroTimer } from '@/features/timers/pomodoro/PomodoroTimer';
import { StopwatchTimer } from '@/features/timers/stopwatch/StopwatchTimer';
import { CountdownTimer } from '@/features/timers/countdown/CountdownTimer';
import { IntervalTimer } from '@/features/timers/interval/IntervalTimer';
import { RepeatingTimer } from '@/features/timers/repeating/RepeatingTimer';
import { useTimerVisibility } from '@/features/timers/visibility/useTimerVisibility';
import { TimerVisibilityBar } from '@/features/timers/visibility/TimerVisibilityBar';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs as SettingsTabs, TabsContent as SettingsTabsContent, TabsList as SettingsTabsList, TabsTrigger as SettingsTabsTrigger } from '@/components/ui/tabs';
import { PublishShareSheet } from '@/features/publishShare/PublishShareSheet';

export type TimerMode = 'pomodoro' | 'stopwatch' | 'countdown' | 'interval' | 'repeating';

function AppContent() {
  const [activeMode, setActiveMode] = useState<TimerMode>('pomodoro');
  const { backgroundUrl, youtubeVideoId, error: backgroundError } = useBackgroundContext();
  
  const hasActiveBackground = (backgroundUrl || youtubeVideoId) && !backgroundError;
  const { isVisible: isTimerVisible, toggleVisibility } = useTimerVisibility(!!hasActiveBackground);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <BackgroundStage />
      <MusicStage />
      
      <div className="relative z-10 flex min-h-screen flex-col pb-12">
        <header className="border-b border-border/50 bg-card/85 backdrop-blur-xl">
          <div className="container mx-auto flex items-center justify-between px-4 py-4">
            <h1 className="text-2xl font-bold tracking-tight">MultiTimer</h1>
            <div className="flex items-center gap-2">
              <PublishShareSheet />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="bg-card/95 backdrop-blur-sm">
                    <Settings className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Settings</SheetTitle>
                    <SheetDescription>
                      Customize your timer experience
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <SettingsTabs defaultValue="background" className="w-full">
                      <SettingsTabsList className="grid w-full grid-cols-2">
                        <SettingsTabsTrigger value="background">Background</SettingsTabsTrigger>
                        <SettingsTabsTrigger value="music">Music</SettingsTabsTrigger>
                      </SettingsTabsList>
                      <SettingsTabsContent value="background" className="mt-4">
                        <BackgroundCustomizer />
                      </SettingsTabsContent>
                      <SettingsTabsContent value="music" className="mt-4">
                        <MusicSettings />
                      </SettingsTabsContent>
                    </SettingsTabs>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>

        <main className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-4xl">
            <Tabs value={activeMode} onValueChange={(v) => setActiveMode(v as TimerMode)} className="w-full">
              {isTimerVisible && (
                <>
                  <TabsList className="mb-8 grid w-full grid-cols-5 bg-card/95 backdrop-blur-xl">
                    <TabsTrigger value="pomodoro" className="text-xs sm:text-sm">
                      Pomodoro
                    </TabsTrigger>
                    <TabsTrigger value="stopwatch" className="text-xs sm:text-sm">
                      Stopwatch
                    </TabsTrigger>
                    <TabsTrigger value="countdown" className="text-xs sm:text-sm">
                      Countdown
                    </TabsTrigger>
                    <TabsTrigger value="interval" className="text-xs sm:text-sm">
                      Interval
                    </TabsTrigger>
                    <TabsTrigger value="repeating" className="text-xs sm:text-sm">
                      Repeating
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="pomodoro" className="mt-0">
                    <PomodoroTimer />
                  </TabsContent>

                  <TabsContent value="stopwatch" className="mt-0">
                    <StopwatchTimer />
                  </TabsContent>

                  <TabsContent value="countdown" className="mt-0">
                    <CountdownTimer />
                  </TabsContent>

                  <TabsContent value="interval" className="mt-0">
                    <IntervalTimer />
                  </TabsContent>

                  <TabsContent value="repeating" className="mt-0">
                    <RepeatingTimer />
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        </main>

        <footer className="border-t border-border/50 bg-card/85 py-4 backdrop-blur-xl">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            © 2026. Built with love using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:underline"
            >
              caffeine.ai
            </a>
          </div>
        </footer>
      </div>
      
      <TimerVisibilityBar isVisible={isTimerVisible} onToggle={toggleVisibility} />
    </div>
  );
}

function App() {
  return (
    <BackgroundProvider>
      <MusicProvider>
        <AppContent />
      </MusicProvider>
    </BackgroundProvider>
  );
}

export default App;
