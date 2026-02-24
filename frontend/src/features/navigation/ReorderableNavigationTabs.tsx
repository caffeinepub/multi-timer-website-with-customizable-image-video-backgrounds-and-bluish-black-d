import { useState, useRef, useEffect } from 'react';
import { NavigationTabId, getNavigationTabLabel } from './navigationTabs';
import { GripVertical } from 'lucide-react';

interface ReorderableNavigationTabsProps {
  order: NavigationTabId[];
  activeTab: NavigationTabId;
  onReorder: (newOrder: NavigationTabId[]) => void;
  onTabChange: (tab: NavigationTabId) => void;
}

export function ReorderableNavigationTabs({ order, activeTab, onReorder, onTabChange }: ReorderableNavigationTabsProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const isDragging = useRef(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent, index: number) => {
    const target = e.target as HTMLElement;
    if (!target.closest('[data-drag-handle]')) {
      return;
    }

    e.preventDefault();
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    setDraggedIndex(index);
    isDragging.current = false;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!dragStartPos.current) return;

      const dx = moveEvent.clientX - dragStartPos.current.x;
      const dy = moveEvent.clientY - dragStartPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 5) {
        isDragging.current = true;
      }

      if (isDragging.current && tabsRef.current) {
        const tabs = Array.from(tabsRef.current.querySelectorAll('[data-tab-index]'));
        let newOverIndex: number | null = null;

        for (let i = 0; i < tabs.length; i++) {
          const tab = tabs[i] as HTMLElement;
          const rect = tab.getBoundingClientRect();
          if (moveEvent.clientX >= rect.left && moveEvent.clientX <= rect.right) {
            newOverIndex = i;
            break;
          }
        }

        setDragOverIndex(newOverIndex);
      }
    };

    const handlePointerUp = () => {
      if (isDragging.current && draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
        const newOrder = [...order];
        const [removed] = newOrder.splice(draggedIndex, 1);
        newOrder.splice(dragOverIndex, 0, removed);
        onReorder(newOrder);
      }

      setDraggedIndex(null);
      setDragOverIndex(null);
      dragStartPos.current = null;
      isDragging.current = false;

      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  useEffect(() => {
    return () => {
      setDraggedIndex(null);
      setDragOverIndex(null);
    };
  }, []);

  return (
    <div 
      ref={tabsRef}
      className="flex items-center gap-1 bg-card/95 backdrop-blur-xl rounded-lg p-1 border"
      role="tablist"
      aria-label="Reorderable navigation tabs"
    >
      {order.map((tabId, index) => {
        const isDragged = draggedIndex === index;
        const isDropTarget = dragOverIndex === index && draggedIndex !== null && draggedIndex !== index;
        const isActive = activeTab === tabId;

        return (
          <div
            key={tabId}
            data-tab-index={index}
            className={`relative flex items-center flex-1 transition-opacity ${isDragged ? 'opacity-50' : ''} ${isDropTarget ? 'drop-target' : ''}`}
          >
            <button
              data-drag-handle
              className="absolute left-1 top-1/2 -translate-y-1/2 z-10 p-1 cursor-grab active:cursor-grabbing touch-none opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity"
              onPointerDown={(e) => handlePointerDown(e, index)}
              aria-label={`Drag to move ${getNavigationTabLabel(tabId)} tab`}
              type="button"
            >
              <GripVertical className="h-3 w-3 text-muted-foreground" />
            </button>
            <button
              role="tab"
              aria-selected={isActive}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              onClick={() => onTabChange(tabId)}
            >
              {getNavigationTabLabel(tabId)}
            </button>
          </div>
        );
      })}
    </div>
  );
}
