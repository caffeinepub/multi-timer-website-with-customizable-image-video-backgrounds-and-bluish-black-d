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

  const valueToRotation = (val: number) => {
    const range = max - min + 1;
    const normalizedValue = val - min;
    return (normalizedValue / range) * 360;
  };

  useEffect(() => {
    setCurrentRotation(valueToRotation(value));
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    return (angle * 180) / Math.PI + 90;
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

      while (newRotation < 0) newRotation += 360;
      while (newRotation >= 360) newRotation -= 360;

      setCurrentRotation(newRotation);

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
        <div className="text-xs font-semibold text-black uppercase tracking-wide">{label}</div>
      )}
      <div
        ref={dialRef}
        className={[
          'relative w-20 h-20 rounded-full border-2 border-black bg-white',
          'flex items-center justify-center',
          disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-grab active:cursor-grabbing',
          isDragging ? 'shadow-lg' : '',
        ].join(' ')}
        onPointerDown={handlePointerDown}
        style={{ transform: `rotate(${currentRotation}deg)` }}
      >
        {/* Indicator dot */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-black" />
        {/* Center value — counter-rotate so text stays upright */}
        <div
          className="text-base font-bold text-black select-none"
          style={{ transform: `rotate(${-currentRotation}deg)` }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}
