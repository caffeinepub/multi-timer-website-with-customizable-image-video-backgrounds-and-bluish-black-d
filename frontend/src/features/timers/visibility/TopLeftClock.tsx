import { useEffect, useState } from 'react';
import { useBackgroundContext } from '@/features/backgrounds/BackgroundProvider';

function formatTime(date: Date): string {
  let hours = date.getHours() % 12;
  if (hours === 0) hours = 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function TopLeftClock() {
  const [now, setNow] = useState(() => new Date());
  const { backgroundUrl, mediaType, youtubeVideoId } = useBackgroundContext();
  const hasActiveBackground = !!(backgroundUrl || youtubeVideoId || mediaType);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (hasActiveBackground) return null;

  return (
    <div
      className="fixed top-4 left-4 z-50 select-none px-3 py-1.5 rounded"
      style={{ border: '2px solid #8B0000' }}
    >
      <span
        className="text-xl font-bold tabular-nums tracking-tight"
        style={{ color: 'var(--foreground)' }}
      >
        {formatTime(now)}
      </span>
    </div>
  );
}
