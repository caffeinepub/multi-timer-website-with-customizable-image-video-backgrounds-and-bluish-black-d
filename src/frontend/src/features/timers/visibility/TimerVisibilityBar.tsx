import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface TimerVisibilityBarProps {
  isVisible: boolean;
  onToggle: () => void;
}

export function TimerVisibilityBar({ isVisible, onToggle }: TimerVisibilityBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-border/40 bg-card/80 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-center px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="gap-2"
        >
          {isVisible ? (
            <>
              <EyeOff className="h-4 w-4" />
              Hide timer
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              Show timer
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
