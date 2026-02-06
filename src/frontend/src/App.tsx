import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BackgroundStage } from '@/features/backgrounds/BackgroundStage';
import { BackgroundCustomizer } from '@/features/backgrounds/BackgroundCustomizer';
import { PomodoroTimer } from '@/features/timers/pomodoro/PomodoroTimer';
import { StopwatchTimer } from '@/features/timers/stopwatch/StopwatchTimer';
import { CountdownTimer } from '@/features/timers/countdown/CountdownTimer';
import { IntervalTimer } from '@/features/timers/interval/IntervalTimer';
import { RepeatingTimer } from '@/features/timers/repeating/RepeatingTimer';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export type TimerMode = 'pomodoro' | 'stopwatch' | 'countdown' | 'interval' | 'repeating';

function App() {
  const [activeMode, setActiveMode] = useState<TimerMode>('pomodoro');

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <BackgroundStage />
      
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="border-b border-border/40 bg-card/60 backdrop-blur-xl">
          <div className="container mx-auto flex items-center justify-between px-4 py-4">
            <h1 className="text-2xl font-bold tracking-tight">MultiTimer</h1>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="bg-card/80 backdrop-blur-sm">
                  <Settings className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Background Settings</SheetTitle>
                  <SheetDescription>
                    Customize your timer background with images or videos
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <BackgroundCustomizer />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        <main className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-4xl">
            <Tabs value={activeMode} onValueChange={(v) => setActiveMode(v as TimerMode)} className="w-full">
              <TabsList className="mb-8 grid w-full grid-cols-5 bg-card/80 backdrop-blur-xl">
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
            </Tabs>
          </div>
        </main>

        <footer className="border-t border-border/40 bg-card/60 backdrop-blur-xl py-4">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            © 2026. Built with ❤️ using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
