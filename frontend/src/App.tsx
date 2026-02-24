import { useState, Component, ErrorInfo, ReactNode, memo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import { BackgroundStage } from './features/backgrounds/BackgroundStage';
import { BackgroundProvider, useBackgroundContext } from './features/backgrounds/BackgroundProvider';
import { BackgroundPlayButton } from './features/backgrounds/BackgroundPlayButton';
import { BackgroundFullscreenButton } from './features/backgrounds/BackgroundFullscreenButton';
import { MusicProvider } from './features/music/MusicProvider';
import { MusicStage } from './features/music/MusicStage';
import { PomodoroTimer } from './features/timers/pomodoro/PomodoroTimer';
import { StopwatchTimer } from './features/timers/stopwatch/StopwatchTimer';
import { CountdownTimer } from './features/timers/countdown/CountdownTimer';
import { IntervalTimer } from './features/timers/interval/IntervalTimer';
import { RepeatingTimer } from './features/timers/repeating/RepeatingTimer';
import { RemindersView } from './features/reminders/RemindersView';
import { RemindersDueNotifier } from './features/reminders/RemindersDueNotifier';
import { TimerVisibilityBar } from './features/timers/visibility/TimerVisibilityBar';
import { useTimerVisibility } from './features/timers/visibility/useTimerVisibility';
import { ReorderableTimerTabs } from './features/timers/navigation/ReorderableTimerTabs';
import { useTimerTabOrder } from './features/timers/navigation/useTimerTabOrder';
import { TimerAlertsProvider } from './features/alerts/TimerAlertsProvider';
import { CustomSoundsProvider } from './features/sounds/CustomSoundsProvider';
import { SoundCustomizationPanel } from './features/sounds/SoundCustomizationPanel';
import { Button } from '@/components/ui/button';
import { APP_NAME } from './branding';

const queryClient = new QueryClient();

export type TimerMode = 'pomodoro' | 'stopwatch' | 'countdown' | 'interval' | 'repeating' | 'reminders';

// Error boundary to prevent blank screens
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <div className="max-w-md space-y-4 text-center">
            <h1 className="text-2xl font-bold text-destructive">Something went wrong</h1>
            <p className="text-muted-foreground">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <Button onClick={() => window.location.reload()}>Reload App</Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Stable media layer — rendered once, never unmounted due to UI state changes.
const StableMediaLayer = memo(function StableMediaLayer() {
  return (
    <>
      <BackgroundStage />
      <MusicStage />
    </>
  );
});

// Timer overlay shown on top of fullscreen video
function TimerOverlay({ activeMode }: { activeMode: TimerMode }) {
  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none"
      style={{ paddingBottom: '0' }}
    >
      <div
        className="pointer-events-auto w-full max-w-sm mx-4"
        style={{
          filter: 'drop-shadow(0 4px 32px rgba(0,0,0,0.7))',
        }}
      >
        {activeMode === 'pomodoro' && <PomodoroTimer />}
        {activeMode === 'stopwatch' && <StopwatchTimer />}
        {activeMode === 'countdown' && <CountdownTimer />}
        {activeMode === 'interval' && <IntervalTimer />}
        {activeMode === 'repeating' && <RepeatingTimer />}
        {activeMode === 'reminders' && <RemindersView />}
      </div>
    </div>
  );
}

// Fullscreen exit hint shown briefly when video is playing
function FullscreenHint() {
  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full text-xs text-white/80 select-none pointer-events-none"
      style={{
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.12)',
      }}
    >
      Press <kbd className="font-mono font-bold">Space</kbd> to pause
    </div>
  );
}

function Layout() {
  const { backgroundUrl, mediaType, youtubeVideoId, isFullscreen, showTimerOverlay } = useBackgroundContext();
  const hasActiveBackground = !!(backgroundUrl || youtubeVideoId || mediaType);
  const {
    isVisible,
    toggleVisibility,
    toggleA,
    toggleA_fn,
    toggleB,
    toggleB_fn,
  } = useTimerVisibility(hasActiveBackground);
  const { order: timerOrder, setOrder: setTimerOrder, resetOrder: resetTimerOrder } = useTimerTabOrder();
  const [activeMode, setActiveMode] = useState<TimerMode>(timerOrder[0]);

  const bannerClasses = 'border-b bg-banner dark:bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-banner/80 dark:supports-[backdrop-filter]:bg-card/80';

  // Fullscreen mode: show only the video background + optional timer overlay + space hint
  if (isFullscreen) {
    return (
      <div className="relative min-h-screen">
        <RemindersDueNotifier />
        {showTimerOverlay && <TimerOverlay activeMode={activeMode} />}
        <FullscreenHint />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <RemindersDueNotifier />

      <div className={`relative z-10 ${isVisible ? 'pb-32' : 'pb-12'}`}>
        {/* Header — hidden when a custom background is active */}
        {!hasActiveBackground && (
          <header className={bannerClasses}>
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-primary">{APP_NAME}</h1>
              </div>
            </div>
          </header>
        )}

        <main className="container mx-auto px-4 py-8">
          {isVisible && (
            <div className="mb-8">
              <ReorderableTimerTabs
                order={timerOrder}
                activeMode={activeMode}
                onReorder={setTimerOrder}
                onModeChange={setActiveMode}
              />
              <div>
                {activeMode === 'pomodoro' && <PomodoroTimer />}
                {activeMode === 'stopwatch' && <StopwatchTimer />}
                {activeMode === 'countdown' && <CountdownTimer />}
                {activeMode === 'interval' && <IntervalTimer />}
                {activeMode === 'repeating' && <RepeatingTimer />}
                {activeMode === 'reminders' && <RemindersView />}
              </div>
            </div>
          )}
        </main>

        {isVisible && !hasActiveBackground && (
          <footer className={bannerClasses}>
            <div className="container mx-auto px-4 py-6">
              <p className="text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} {APP_NAME}. Built with ❤️ using{' '}
                <a
                  href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                    typeof window !== 'undefined' ? window.location.hostname : 'unknown-app'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  caffeine.ai
                </a>
              </p>
            </div>
          </footer>
        )}
      </div>

      {/* Floating play button — visible when video background is active but not fullscreen */}
      <BackgroundPlayButton />

      {/* Floating fullscreen button — visible when any background is active */}
      <BackgroundFullscreenButton />

      {/* Bottom visibility bar — always visible */}
      <TimerVisibilityBar
        isVisible={isVisible}
        onToggle={toggleVisibility}
        toggleA={toggleA}
        onToggleA={toggleA_fn}
        toggleB={toggleB}
        onToggleB={toggleB_fn}
        onResetTimerOrder={resetTimerOrder}
      />

      {isVisible && <SoundCustomizationPanel />}
    </div>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => null,
});

const routeTree = rootRoute.addChildren([indexRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BackgroundProvider>
          <MusicProvider>
            <CustomSoundsProvider>
              <TimerAlertsProvider>
                <StableMediaLayer />
                <RouterProvider router={router} />
                <Toaster />
              </TimerAlertsProvider>
            </CustomSoundsProvider>
          </MusicProvider>
        </BackgroundProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
