import { useState, useRef, KeyboardEvent } from 'react';
import { useTasks, ListMode } from './useTasks';
import { X, Plus, List, ListOrdered, CheckSquare, Trash2 } from 'lucide-react';

interface TasksPanelProps {
  onClose: () => void;
}

const MODE_OPTIONS: { mode: ListMode; label: string; icon: React.ReactNode }[] = [
  { mode: 'bulleted', label: 'Bullets', icon: <List className="h-3.5 w-3.5" /> },
  { mode: 'numbered', label: 'Numbers', icon: <ListOrdered className="h-3.5 w-3.5" /> },
  { mode: 'todo', label: 'To-Do', icon: <CheckSquare className="h-3.5 w-3.5" /> },
];

// Pink/crimson palette matching the Settings panel
const PINK_BG = '#fdf2f4';
const CRIMSON = '#9b1c3a';
const PINK_ACTIVE = '#f7dde3';
const PINK_BORDER = '#f3d0d8';

export function TasksPanel({ onClose }: TasksPanelProps) {
  const { items, mode, addItem, toggleItem, deleteItem, setMode, clearAll } = useTasks();
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    if (inputValue.trim()) {
      addItem(inputValue);
      setInputValue('');
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div
      className="fixed z-40 flex flex-col"
      style={{
        bottom: '50px',
        right: '16px',
        width: '300px',
        maxHeight: '420px',
        background: '#ffffff',
        border: `1.5px solid ${PINK_BORDER}`,
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(155,28,58,0.12)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: `1px solid ${PINK_BORDER}`, background: PINK_BG }}
      >
        <span className="text-sm font-semibold" style={{ color: CRIMSON }}>
          Tasks
        </span>
        <div className="flex items-center gap-1">
          {items.length > 0 && (
            <button
              onClick={clearAll}
              title="Clear all tasks"
              className="flex items-center justify-center rounded p-1 transition-colors"
              style={{ color: CRIMSON, opacity: 0.6 }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={onClose}
            title="Close tasks"
            className="flex items-center justify-center rounded p-1 transition-colors"
            style={{ color: CRIMSON, opacity: 0.6 }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Mode selector */}
      <div
        className="flex items-center gap-1 px-3 py-2"
        style={{ borderBottom: `1px solid ${PINK_BORDER}`, background: PINK_BG }}
      >
        {MODE_OPTIONS.map(opt => (
          <button
            key={opt.mode}
            onClick={() => setMode(opt.mode)}
            className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors"
            style={{
              background: mode === opt.mode ? CRIMSON : 'transparent',
              color: mode === opt.mode ? '#ffffff' : CRIMSON,
              border: mode === opt.mode ? `1px solid ${CRIMSON}` : `1px solid transparent`,
              opacity: mode === opt.mode ? 1 : 0.75,
            }}
            onMouseEnter={e => {
              if (mode !== opt.mode) {
                e.currentTarget.style.background = PINK_ACTIVE;
                e.currentTarget.style.opacity = '1';
              }
            }}
            onMouseLeave={e => {
              if (mode !== opt.mode) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.opacity = '0.75';
              }
            }}
          >
            {opt.icon}
            {opt.label}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ background: '#ffffff', minHeight: 0 }}
      >
        {items.length === 0 ? (
          <div
            className="flex items-center justify-center py-8 text-xs"
            style={{ color: '#9ca3af' }}
          >
            No tasks yet. Add one below!
          </div>
        ) : (
          <ul className="py-1">
            {items.map((item, index) => (
              <li
                key={item.id}
                className="group flex items-start gap-2 px-4 py-2 transition-colors"
                style={{ background: '#ffffff' }}
                onMouseEnter={e => (e.currentTarget.style.background = PINK_BG)}
                onMouseLeave={e => (e.currentTarget.style.background = '#ffffff')}
              >
                {/* Prefix */}
                {mode === 'bulleted' && (
                  <span
                    className="mt-0.5 shrink-0 text-sm font-bold select-none"
                    style={{ color: CRIMSON, lineHeight: '1.4' }}
                  >
                    •
                  </span>
                )}
                {mode === 'numbered' && (
                  <span
                    className="mt-0.5 shrink-0 text-xs font-semibold select-none tabular-nums"
                    style={{ color: CRIMSON, lineHeight: '1.6', minWidth: '16px' }}
                  >
                    {index + 1}.
                  </span>
                )}
                {mode === 'todo' && (
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleItem(item.id)}
                    className="mt-0.5 shrink-0 cursor-pointer"
                    style={{
                      width: '14px',
                      height: '14px',
                      accentColor: CRIMSON,
                    }}
                    aria-label={`Mark "${item.text}" as ${item.completed ? 'incomplete' : 'complete'}`}
                  />
                )}

                {/* Text */}
                <span
                  className="flex-1 text-sm leading-snug break-words"
                  style={{
                    color: '#111827',
                    textDecoration: mode === 'todo' && item.completed ? 'line-through' : 'none',
                    opacity: mode === 'todo' && item.completed ? 0.5 : 1,
                  }}
                >
                  {item.text}
                </span>

                {/* Delete button */}
                <button
                  onClick={() => deleteItem(item.id)}
                  title="Delete task"
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded p-0.5"
                  style={{ color: CRIMSON, opacity: 0 }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
                >
                  <X className="h-3 w-3" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Input area */}
      <div
        className="flex items-center gap-2 px-3 py-2.5"
        style={{ borderTop: `1px solid ${PINK_BORDER}`, background: PINK_BG }}
      >
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a task..."
          className="flex-1 text-sm outline-none bg-transparent"
          style={{
            color: '#111827',
            caretColor: CRIMSON,
          }}
        />
        <button
          onClick={handleAdd}
          disabled={!inputValue.trim()}
          title="Add task"
          className="flex items-center justify-center rounded-full transition-colors disabled:opacity-30"
          style={{
            width: '24px',
            height: '24px',
            background: CRIMSON,
            color: '#ffffff',
            flexShrink: 0,
          }}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
