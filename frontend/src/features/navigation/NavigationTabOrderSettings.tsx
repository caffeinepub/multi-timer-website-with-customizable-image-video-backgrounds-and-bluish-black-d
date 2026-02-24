import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface NavigationTabOrderSettingsProps {
  onReset: () => void;
}

export function NavigationTabOrderSettings({ onReset }: NavigationTabOrderSettingsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Navigation Tab Order</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Drag the grip icon on each navigation tab to reorder them. Your custom order will be saved automatically.
        </p>
      </div>
      <Button 
        variant="outline" 
        onClick={onReset}
        className="w-full"
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        Reset to Default Order
      </Button>
    </div>
  );
}
