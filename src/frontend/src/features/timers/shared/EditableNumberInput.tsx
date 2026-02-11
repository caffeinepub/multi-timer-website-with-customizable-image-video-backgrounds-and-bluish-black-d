import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';

interface EditableNumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export function EditableNumberInput({
  value,
  onChange,
  min = 0,
  max = 999,
  disabled = false,
  id,
  className,
}: EditableNumberInputProps) {
  const [displayValue, setDisplayValue] = useState(value.toString());
  const [isFocused, setIsFocused] = useState(false);

  // Sync with external value changes when not focused
  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(value.toString());
    }
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Allow empty string or valid numbers
    if (newValue === '' || /^\d+$/.test(newValue)) {
      setDisplayValue(newValue);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Commit the value
    if (displayValue === '') {
      // If empty, set to min value
      onChange(min);
      setDisplayValue(min.toString());
    } else {
      const numValue = parseInt(displayValue, 10);
      const clampedValue = Math.max(min, Math.min(max, numValue));
      onChange(clampedValue);
      setDisplayValue(clampedValue.toString());
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return (
    <Input
      id={id}
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={className}
    />
  );
}
