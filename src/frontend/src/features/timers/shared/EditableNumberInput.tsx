import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

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
    if (newValue === "" || /^\d+$/.test(newValue)) {
      setDisplayValue(newValue);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    const parsed = Number.parseInt(displayValue, 10);
    if (!Number.isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      onChange(clamped);
      setDisplayValue(clamped.toString());
    } else {
      setDisplayValue(value.toString());
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    }
    if (e.key === "Escape") {
      setDisplayValue(value.toString());
      setIsFocused(false);
      (e.target as HTMLInputElement).blur();
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
      className={[
        "text-center font-bold text-foreground bg-background border-2 border-border",
        "focus:ring-2 focus:ring-ring focus:ring-offset-1",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
