import React from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import { Category, FilterStatus, SortOption } from '../types/todo';

interface TodoFiltersProps {
  status: FilterStatus;
  onStatusChange: (status: FilterStatus) => void;
  selectedCategory: Category | 'all';
  onCategoryChange: (category: Category | 'all') => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const CATEGORIES: (Category | 'all')[] = ['all', '개인', '업무', '공부', '건강', '기타'];

export const TodoFilters: React.FC<TodoFiltersProps> = ({
  status,
  onStatusChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="my-6 space-y-4">
      {/* 1행: 검색창 & 정렬 */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* 검색 입력 */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="할 일 검색하기..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-100 placeholder-slate-400 shadow-sm"
          />
        </div>

        {/* 정렬 드롭다운 */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium outline-none text-slate-700 dark:text-slate-200 cursor-pointer shadow-sm focus:border-indigo-500"
          >
            <option value="createdAt-desc">최신 등록순</option>
            <option value="createdAt-asc">오래된 순</option>
            <option value="dueDate-asc">마감일 임박순</option>
            <option value="priority-desc">중요도 높은순</option>
          </select>
        </div>
      </div>

      {/* 2행: 상태 탭 & 카테고리 칩 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
        {/* 상태 탭 */}
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl w-fit border border-slate-200/60 dark:border-slate-800">
          <button
            onClick={() => onStatusChange('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              status === 'all'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => onStatusChange('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              status === 'active'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            진행 중
          </button>
          <button
            onClick={() => onStatusChange('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              status === 'completed'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            완료됨
          </button>
        </div>

        {/* 카테고리 칩 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition whitespace-nowrap border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {cat === 'all' ? '전체 카테고리' : cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

