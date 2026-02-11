import { Label } from '@/components/ui/label';
import { EditableNumberInput } from './EditableNumberInput';

interface MinutesSecondsInputProps {
  /** Total duration in seconds */
  value: number;
  /** Callback with updated total seconds */
  onChange: (totalSeconds: number) => void;
  /** Whether the inputs are disabled */
  disabled?: boolean;
  /** Optional label for the input group */
  label?: string;
  /** Optional ID prefix for the inputs */
  id?: string;
  /** Maximum minutes allowed (default 999) */
  maxMinutes?: number;
}

export function MinutesSecondsInput({
  value,
  onChange,
  disabled = false,
  label,
  id,
  maxMinutes = 999,
}: MinutesSecondsInputProps) {
  // Decompose total seconds into minutes and seconds
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;

  const handleMinutesChange = (newMinutes: number) => {
    // Clamp minutes to valid range
    const clampedMinutes = Math.max(0, Math.min(maxMinutes, newMinutes));
    const newTotal = clampedMinutes * 60 + seconds;
    
    // Ensure at least 1 second total
    onChange(Math.max(1, newTotal));
  };

  const handleSecondsChange = (newSeconds: number) => {
    // Clamp seconds to 0-59
    const clampedSeconds = Math.max(0, Math.min(59, newSeconds));
    const newTotal = minutes * 60 + clampedSeconds;
    
    // Ensure at least 1 second total
    onChange(Math.max(1, newTotal));
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex items-center gap-2">
        <div className="flex-1 space-y-1">
          <Label htmlFor={id ? `${id}-minutes` : undefined} className="text-xs text-muted-foreground">
            Min
          </Label>
          <EditableNumberInput
            id={id ? `${id}-minutes` : undefined}
            value={minutes}
            onChange={handleMinutesChange}
            min={0}
            max={maxMinutes}
            disabled={disabled}
          />
        </div>
        <span className="text-2xl font-bold text-muted-foreground pt-5">:</span>
        <div className="flex-1 space-y-1">
          <Label htmlFor={id ? `${id}-seconds` : undefined} className="text-xs text-muted-foreground">
            Sec
          </Label>
          <EditableNumberInput
            id={id ? `${id}-seconds` : undefined}
            value={seconds}
            onChange={handleSecondsChange}
            min={0}
            max={59}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
