import React, { useState, useRef, useEffect } from 'react';
import { Check, Trash2, Edit2, Flame, Zap, Sprout } from 'lucide-react';
import { Todo } from '../types/todo';
import { getDDayBadge } from '../utils/date';
import { CATEGORY_COLORS } from '../constants/initialData';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editTitle.trim()) {
      onEdit(todo.id, editTitle.trim());
    } else {
      setEditTitle(todo.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditTitle(todo.title);
      setIsEditing(false);
    }
  };

  const dDayInfo = getDDayBadge(todo.dueDate);
  const categoryStyle = CATEGORY_COLORS[todo.category] || CATEGORY_COLORS['기타'];

  const getPriorityIcon = () => {
    switch (todo.priority) {
      case 'high':
        return (
          <span title="높은 중요도" className="flex items-center text-rose-500">
            <Flame className="w-3.5 h-3.5 fill-rose-500/20" />
          </span>
        );
      case 'medium':
        return (
          <span title="보통 중요도" className="flex items-center text-amber-500">
            <Zap className="w-3.5 h-3.5 fill-amber-500/20" />
          </span>
        );
      case 'low':
        return (
          <span title="낮은 중요도" className="flex items-center text-emerald-500">
            <Sprout className="w-3.5 h-3.5 fill-emerald-500/20" />
          </span>
        );
    }
  };

  return (
    <div
      className={`group flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-200 ${
        todo.completed
          ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-60'
          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* 체크박스 */}
      <button
        onClick={() => onToggle(todo.id)}
        className="mt-0.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition shrink-0"
      >
        {todo.completed ? (
          <div className="w-5 h-5 rounded-md bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        ) : (
          <div className="w-5 h-5 rounded-md border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-500 transition" />
        )}
      </button>

      {/* 본문 영역 */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-indigo-500 rounded-md px-2 py-0.5 text-sm text-slate-800 dark:text-slate-100 outline-none"
          />
        ) : (
          <p
            onDoubleClick={() => !todo.completed && setIsEditing(true)}
            className={`text-sm break-words leading-relaxed select-none ${
              todo.completed
                ? 'line-through text-slate-400 dark:text-slate-500'
                : 'text-slate-800 dark:text-slate-200'
            }`}
          >
            {todo.title}
          </p>
        )}

        {/* 메타데이터 (태그, 마감일, 우선순위) */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          {/* 중요도 뱃지 */}
          {getPriorityIcon()}

          {/* 카테고리 뱃지 */}
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${categoryStyle.bg} ${categoryStyle.darkBg}`}
          >
            {todo.category}
          </span>

          {/* 마감일 & D-Day 뱃지 */}
          {dDayInfo && (
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${dDayInfo.colorClass}`}>
              {dDayInfo.text}
              {todo.dueDate && (
                <span className="opacity-75 ml-1 hidden sm:inline">({todo.dueDate})</span>
              )}
            </span>
          )}
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {!todo.completed && (
          <button
            onClick={() => setIsEditing(true)}
            title="수정"
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={() => onDelete(todo.id)}
          title="삭제"
          className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

