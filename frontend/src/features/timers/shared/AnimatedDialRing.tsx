interface AnimatedDialRingProps {
  /** Total seconds to derive minutes (0–59) and seconds (0–59) from */
  totalSeconds: number;
  /** Diameter of the outer ring in pixels */
  size?: number;
}

/**
 * SVG-based animated dial ring.
 * Outer arc = seconds (0–59), inner arc = minutes (0–59).
 * High-contrast: black strokes on white background.
 */
export function AnimatedDialRing({ totalSeconds, size = 220 }: AnimatedDialRingProps) {
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;

  const strokeWidth = 6;
  const gap = 10;

  // Outer ring (seconds)
  const outerRadius = (size - strokeWidth) / 2;
  const outerCircumference = 2 * Math.PI * outerRadius;
  const secondsFraction = seconds / 60;
  const secondsDash = secondsFraction * outerCircumference;

  // Inner ring (minutes)
  const innerRadius = outerRadius - strokeWidth - gap;
  const innerCircumference = 2 * Math.PI * innerRadius;
  const minutesFraction = minutes / 60;
  const minutesDash = minutesFraction * innerCircumference;

  const center = size / 2;

  // Tick marks on the outer ring (60 ticks)
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const angle = (i / 60) * 2 * Math.PI - Math.PI / 2;
    const isMajor = i % 5 === 0;
    const tickLen = isMajor ? 8 : 4;
    const r1 = outerRadius + strokeWidth / 2 + 3;
    const r2 = r1 + tickLen;
    return {
      x1: center + r1 * Math.cos(angle),
      y1: center + r1 * Math.sin(angle),
      x2: center + r2 * Math.cos(angle),
      y2: center + r2 * Math.sin(angle),
      isMajor,
    };
  });

  return (
    <svg
      width={size + 32}
      height={size + 32}
      viewBox={`${-16} ${-16} ${size + 32} ${size + 32}`}
      aria-hidden="true"
      style={{ overflow: 'visible' }}
    >
      {/* Tick marks */}
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke="#000000"
          strokeWidth={t.isMajor ? 1.5 : 0.8}
          strokeLinecap="round"
          opacity={t.isMajor ? 0.7 : 0.35}
        />
      ))}

      {/* Outer track (seconds background) */}
      <circle
        cx={center}
        cy={center}
        r={outerRadius}
        fill="none"
        stroke="#000000"
        strokeWidth={strokeWidth}
        opacity={0.15}
      />

      {/* Outer arc (seconds progress) */}
      <circle
        cx={center}
        cy={center}
        r={outerRadius}
        fill="none"
        stroke="#000000"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${secondsDash} ${outerCircumference}`}
        strokeDashoffset={0}
        transform={`rotate(-90 ${center} ${center})`}
        style={{ transition: 'stroke-dasharray 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
      />

      {/* Seconds dot indicator */}
      {seconds > 0 && (
        <circle
          cx={center + outerRadius * Math.cos(secondsFraction * 2 * Math.PI - Math.PI / 2)}
          cy={center + outerRadius * Math.sin(secondsFraction * 2 * Math.PI - Math.PI / 2)}
          r={strokeWidth / 2 + 1}
          fill="#000000"
          style={{
            transition:
              'cx 0.6s cubic-bezier(0.4, 0, 0.2, 1), cy 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      )}

      {/* Inner track (minutes background) */}
      <circle
        cx={center}
        cy={center}
        r={innerRadius}
        fill="none"
        stroke="#000000"
        strokeWidth={strokeWidth}
        opacity={0.15}
      />

      {/* Inner arc (minutes progress) */}
      <circle
        cx={center}
        cy={center}
        r={innerRadius}
        fill="none"
        stroke="#000000"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${minutesDash} ${innerCircumference}`}
        strokeDashoffset={0}
        transform={`rotate(-90 ${center} ${center})`}
        style={{ transition: 'stroke-dasharray 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
      />

      {/* Minutes dot indicator */}
      {minutes > 0 && (
        <circle
          cx={center + innerRadius * Math.cos(minutesFraction * 2 * Math.PI - Math.PI / 2)}
          cy={center + innerRadius * Math.sin(minutesFraction * 2 * Math.PI - Math.PI / 2)}
          r={strokeWidth / 2 + 1}
          fill="#000000"
          style={{
            transition:
              'cx 0.6s cubic-bezier(0.4, 0, 0.2, 1), cy 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      )}
    </svg>
  );
}
