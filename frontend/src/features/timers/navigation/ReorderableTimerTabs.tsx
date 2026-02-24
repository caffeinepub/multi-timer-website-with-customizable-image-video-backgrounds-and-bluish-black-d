import { useState, useRef, useCallback, useEffect } from 'react';
import { TimerMode } from '@/App';
import { getTimerModeLabel } from './timerModes';

interface ReorderableTimerTabsProps {
  order: TimerMode[];
  activeMode: TimerMode;
  onReorder: (newOrder: TimerMode[]) => void;
  onModeChange: (mode: TimerMode) => void;
}

export function ReorderableTimerTabs({
  order,
  activeMode,
  onReorder,
  onModeChange,
}: ReorderableTimerTabsProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [dragX, setDragX] = useState(0);
  const [tabWidths, setTabWidths] = useState<number[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dragStartClientX = useRef(0);
  const isDraggingRef = useRef(false);
  const draggedIndexRef = useRef<number | null>(null);
  const overIndexRef = useRef<number | null>(null);
  const clickThreshold = 5;

  useEffect(() => {
    const widths = tabRefs.current.map((el) => el?.offsetWidth ?? 0);
    setTabWidths(widths);
  }, [order]);

  const getTabOffset = useCallback(
    (fromIndex: number, toIndex: number, currentDraggedIndex: number | null, currentOverIndex: number | null): number => {
      if (currentDraggedIndex === null || currentOverIndex === null) return 0;
      if (fromIndex === currentDraggedIndex) return 0;
      const draggedWidth = tabWidths[currentDraggedIndex] ?? 0;
      if (currentDraggedIndex < currentOverIndex) {
        if (fromIndex > currentDraggedIndex && fromIndex <= currentOverIndex) {
          return -draggedWidth;
        }
      }
      if (currentDraggedIndex > currentOverIndex) {
        if (fromIndex >= currentOverIndex && fromIndex < currentDraggedIndex) {
          return draggedWidth;
        }
      }
      return 0;
    },
    [tabWidths]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>, index: number) => {
      e.preventDefault();
      (e.currentTarget as HTMLButtonElement).setPointerCapture(e.pointerId);

      dragStartClientX.current = e.clientX;
      isDraggingRef.current = false;
      draggedIndexRef.current = index;
      overIndexRef.current = index;

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const dx = moveEvent.clientX - dragStartClientX.current;

        if (!isDraggingRef.current && Math.abs(dx) > clickThreshold) {
          isDraggingRef.current = true;
          setDraggedIndex(index);
          setOverIndex(index);
        }

        if (!isDraggingRef.current) return;

        setDragX(dx);

        if (containerRef.current) {
          const containerRect = containerRef.current.getBoundingClientRect();
          const relativeX = moveEvent.clientX - containerRect.left;

          let accumulated = 0;
          let newOverIndex = index;

          for (let i = 0; i < order.length; i++) {
            const w = tabWidths[i] ?? 0;
            const center = accumulated + w / 2;
            if (relativeX <= center) {
              newOverIndex = i;
              break;
            }
            accumulated += w;
            if (i === order.length - 1) {
              newOverIndex = order.length - 1;
            }
          }

          if (newOverIndex !== overIndexRef.current) {
            overIndexRef.current = newOverIndex;
            setOverIndex(newOverIndex);
          }
        }
      };

      const handlePointerUp = () => {
        const wasDragging = isDraggingRef.current;
        const finalDraggedIndex = draggedIndexRef.current;
        const finalOverIndex = overIndexRef.current;

        isDraggingRef.current = false;
        draggedIndexRef.current = null;
        overIndexRef.current = null;

        setDraggedIndex(null);
        setOverIndex(null);
        setDragX(0);

        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);

        if (
          wasDragging &&
          finalDraggedIndex !== null &&
          finalOverIndex !== null &&
          finalDraggedIndex !== finalOverIndex
        ) {
          const newOrder = [...order];
          const [removed] = newOrder.splice(finalDraggedIndex, 1);
          newOrder.splice(finalOverIndex, 0, removed);
          onReorder(newOrder);
        } else if (!wasDragging) {
          onModeChange(order[index]);
        }
      };

      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
    },
    [order, tabWidths, onReorder, onModeChange]
  );

  return (
    <div
      ref={containerRef}
      className="relative flex w-full rounded-lg bg-white border border-black p-1 gap-0.5 mb-4 select-none"
      style={{ userSelect: 'none' }}
      aria-label="Timer tabs"
    >
      {order.map((mode, index) => {
        const isDragged = draggedIndex === index;
        const isActive = activeMode === mode;

        const slideOffset =
          draggedIndex !== null
            ? getTabOffset(index, overIndex ?? draggedIndex, draggedIndex, overIndex)
            : 0;

        const dragTranslate = isDragged ? dragX : slideOffset;

        return (
          <button
            key={mode}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            type="button"
            data-tab-index={index}
            aria-label={getTimerModeLabel(mode)}
            aria-selected={isActive}
            role="tab"
            onPointerDown={(e) => handlePointerDown(e, index)}
            style={{
              transform: `translateX(${dragTranslate}px)`,
              transition: isDragged ? 'none' : 'transform 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              zIndex: isDragged ? 50 : 1,
              position: 'relative',
              cursor: isDragged ? 'grabbing' : 'grab',
              boxShadow: isDragged
                ? '0 8px 24px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.12)'
                : undefined,
              scale: isDragged ? '1.06' : undefined,
            }}
            className={[
              'flex-1 min-w-0 px-2 py-2 rounded-md text-xs sm:text-sm font-semibold',
              'transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black',
              'text-black',
              isDragged
                ? 'bg-black text-white opacity-95 rounded-md'
                : isActive
                ? 'bg-black text-white shadow-sm'
                : 'bg-white text-black hover:bg-black/10 border border-transparent',
              !isDragged && draggedIndex !== null && overIndex === index
                ? 'ring-2 ring-black ring-inset'
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {getTimerModeLabel(mode)}
          </button>
        );
      })}
    </div>
  );
}
