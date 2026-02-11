import { useRef, useEffect, useState } from 'react';

interface RotaryDialProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  label?: string;
}

export function RotaryDial({
  value,
  onChange,
  min = 1,
  max = 60,
  disabled = false,
  label,
}: RotaryDialProps) {
  const dialRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startAngle, setStartAngle] = useState(0);
  const [currentRotation, setCurrentRotation] = useState(0);

  // Calculate rotation based on value
  const valueToRotation = (val: number) => {
    const range = max - min + 1;
    const normalizedValue = val - min;
    return (normalizedValue / range) * 360;
  };

  useEffect(() => {
    setCurrentRotation(valueToRotation(value));
  }, [value, min, max]);

  const getAngleFromEvent = (e: MouseEvent | TouchEvent, rect: DOMRect) => {
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const angle = Math.atan2(clientY - centerY, clientX - centerX);
    return (angle * 180) / Math.PI + 90; // Normalize to 0-360 with 0 at top
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
    
    const rect = dialRef.current?.getBoundingClientRect();
    if (rect) {
      const angle = getAngleFromEvent(e.nativeEvent, rect);
      setStartAngle(angle - currentRotation);
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const rect = dialRef.current?.getBoundingClientRect();
      if (!rect) return;

      const angle = getAngleFromEvent(e, rect);
      let newRotation = angle - startAngle;
      
      // Normalize to 0-360
      while (newRotation < 0) newRotation += 360;
      while (newRotation >= 360) newRotation -= 360;

      setCurrentRotation(newRotation);

      // Convert rotation to value
      const range = max - min + 1;
      const normalizedValue = Math.round((newRotation / 360) * range);
      const newValue = Math.max(min, Math.min(max, normalizedValue + min));
      
      if (newValue !== value) {
        onChange(newValue);
      }
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handlePointerMove);
    document.addEventListener('mouseup', handlePointerUp);
    document.addEventListener('touchmove', handlePointerMove);
    document.addEventListener('touchend', handlePointerUp);

    return () => {
      document.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('mouseup', handlePointerUp);
      document.removeEventListener('touchmove', handlePointerMove);
      document.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging, startAngle, value, min, max, onChange]);

  return (
    <div className="flex flex-col items-center gap-2">
      {label && (
        <div className="text-sm font-medium text-muted-foreground">{label}</div>
      )}
      <div
        ref={dialRef}
        className={`rotary-dial ${disabled ? 'rotary-dial-disabled' : ''} ${isDragging ? 'rotary-dial-dragging' : ''}`}
        onPointerDown={handlePointerDown}
        style={{
          transform: `rotate(${currentRotation}deg)`,
        }}
      >
        <div className="rotary-dial-indicator" />
        <div className="rotary-dial-center">
          <span className="text-lg font-bold">{value}</span>
        </div>
      </div>
    </div>
  );
}
