import React from 'react';
import { Inbox, Trash } from 'lucide-react';
import { Todo } from '../types/todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
  onClearCompleted: () => void;
  completedCount: number;
  activeCount: number;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggle,
  onDelete,
  onEdit,
  onClearCompleted,
  completedCount,
  activeCount,
}) => {
  if (todos.length === 0) {
    return (
      <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <Inbox className="w-6 h-6 stroke-[1.7]" />
        </div>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          표시할 할 일이 없습니다.
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          새로운 할 일을 추가하거나 필터를 변경해 보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 리스트 본문 */}
      <div className="space-y-2">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>

      {/* 하단 요약 및 액션 */}
      <div className="flex items-center justify-between pt-3 px-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800">
        <span>남은 할 일: <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">{activeCount}</strong>개</span>
        {completedCount > 0 && (
          <button
            onClick={onClearCompleted}
            className="flex items-center gap-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition"
          >
            <Trash className="w-3.5 h-3.5" />
            <span>완료된 항목 모두 지우기 ({completedCount})</span>
          </button>
        )}
      </div>
    </div>
  );
};

