import React from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import { Category, SortOption } from '../types/todo';
import { SmartView } from './Sidebar';
import { formatKoreanDate } from '../utils/date';

interface MainHeaderProps {
  currentView: SmartView;
  selectedCategory: Category | 'all';
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  itemCount: number;
}

export const MainHeader: React.FC<MainHeaderProps> = ({
  currentView,
  selectedCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  itemCount,
}) => {
  const getViewTitle = () => {
    if (selectedCategory !== 'all') {
      return `${selectedCategory} 할 일`;
    }
    switch (currentView) {
      case 'today':
        return '오늘 마감인 할 일';
      case 'important':
        return '중요 할 일 🔥';
      case 'completed':
        return '완료된 항목';
      case 'all':
      default:
        return '전체 할 일';
    }
  };

  return (
    <div className="mb-6 space-y-4">
      {/* 1행: 뷰 타이틀 & 오늘 날짜 */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {getViewTitle()}
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
              {itemCount}개
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{formatKoreanDate()}</p>
        </div>

        {/* 정렬 드롭다운 */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-medium outline-none text-slate-700 dark:text-slate-200 cursor-pointer shadow-sm focus:border-indigo-500"
          >
            <option value="createdAt-desc">최신 등록순</option>
            <option value="createdAt-asc">오래된 순</option>
            <option value="dueDate-asc">마감일 임박순</option>
            <option value="priority-desc">중요도 높은순</option>
          </select>
        </div>
      </div>

      {/* 2행: 검색 바 */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="할 일 목록에서 검색..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-100 placeholder-slate-400 shadow-sm"
        />
      </div>
    </div>
  );
};

