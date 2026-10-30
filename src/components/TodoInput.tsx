import React, { useState } from 'react';
import { Plus, Calendar, Tag, AlertCircle } from 'lucide-react';
import { Category, Priority } from '../types/todo';

interface TodoInputProps {
  onAddTodo: (title: string, priority: Priority, category: Category, dueDate?: string) => void;
}

const CATEGORIES: Category[] = ['개인', '업무', '공부', '건강', '기타'];

export const TodoInput: React.FC<TodoInputProps> = ({ onAddTodo }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('개인');
  const [dueDate, setDueDate] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTodo(title.trim(), priority, category, dueDate || undefined);
    setTitle('');
    setDueDate('');
    setPriority('medium');
    setIsExpanded(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500"
    >
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          placeholder="오늘 어떤 일을 계획하고 있나요? (Enter로 추가)"
          className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-base"
        />
        <button
          type="submit"
          disabled={!title.trim()}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-medium text-sm flex items-center gap-1.5 transition shadow-sm shadow-indigo-600/30 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>추가</span>
        </button>
      </div>

      {/* 부가 세부 옵션 (확장 영역) */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* 카테고리 선택 */}
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 outline-none cursor-pointer focus:border-indigo-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* 마감일 선택 */}
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 outline-none cursor-pointer focus:border-indigo-500 text-slate-700 dark:text-slate-200"
              />
            </div>

            {/* 중요도 선택 */}
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 outline-none cursor-pointer focus:border-indigo-500"
              >
                <option value="high">중요도: 높음 🔥</option>
                <option value="medium">중요도: 보통 ⚡</option>
                <option value="low">중요도: 낮음 🌱</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 ml-auto"
          >
            접기
          </button>
        </div>
      )}
    </form>
  );
};

