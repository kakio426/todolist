import React from 'react';
import {
  CheckCircle2,
  Inbox,
  Calendar,
  Flame,
  CheckCheck,
  Tag,
  Moon,
  Sun,
  Download,
  RefreshCw,
} from 'lucide-react';
import { Category, Todo } from '../types/todo';

export type SmartView = 'all' | 'today' | 'important' | 'completed';

interface SidebarProps {
  currentView: SmartView;
  onSelectView: (view: SmartView) => void;
  selectedCategory: Category | 'all';
  onSelectCategory: (category: Category | 'all') => void;
  todos: Todo[];
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenBackup: () => void;
  onResetData: () => void;
}

const CATEGORIES: Category[] = ['개인', '업무', '공부', '건강', '기타'];

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  selectedCategory,
  onSelectCategory,
  todos,
  darkMode,
  onToggleDarkMode,
  onOpenBackup,
  onResetData,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // 각 뷰별 카운트 계산
  const totalActive = todos.filter((t) => !t.completed).length;
  const todayCount = todos.filter((t) => !t.completed && t.dueDate === todayStr).length;
  const importantCount = todos.filter((t) => !t.completed && t.priority === 'high').length;
  const completedCount = todos.filter((t) => t.completed).length;

  // 카테고리별 미완료 카운트
  const getCategoryCount = (cat: Category) =>
    todos.filter((t) => !t.completed && t.category === cat).length;

  const percentage = todos.length === 0 ? 0 : Math.round((completedCount / todos.length) * 100);

  return (
    <aside className="w-64 lg:w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen sticky top-0 select-none shrink-0 transition-colors">
      {/* 1. 상단 로고 & 타이틀 */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
          <CheckCircle2 className="w-5 h-5 stroke-[2.3]" />
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
            오늘의 할 일
          </h1>
          <p className="text-[11px] text-slate-400">Desktop Workspace</p>
        </div>
      </div>

      {/* 2. 네비게이션 메뉴 (스크롤 가능) */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
        {/* 주요 스마트 뷰 */}
        <div>
          <p className="px-2.5 mb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            메뉴
          </p>
          <nav className="space-y-1">
            <button
              onClick={() => {
                onSelectView('all');
                onSelectCategory('all');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                currentView === 'all' && selectedCategory === 'all'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Inbox className="w-4 h-4 text-indigo-500" />
                <span>전체 할 일</span>
              </div>
              <span className="text-[11px] px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                {totalActive}
              </span>
            </button>

            <button
              onClick={() => {
                onSelectView('today');
                onSelectCategory('all');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                currentView === 'today'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-amber-500" />
                <span>오늘 마감</span>
              </div>
              {todayCount > 0 && (
                <span className="text-[11px] px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-semibold">
                  {todayCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                onSelectView('important');
                onSelectCategory('all');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                currentView === 'important'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Flame className="w-4 h-4 text-rose-500" />
                <span>중요 할 일</span>
              </div>
              {importantCount > 0 && (
                <span className="text-[11px] px-1.5 py-0.2 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-semibold">
                  {importantCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                onSelectView('completed');
                onSelectCategory('all');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                currentView === 'completed'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckCheck className="w-4 h-4 text-emerald-500" />
                <span>완료된 항목</span>
              </div>
              <span className="text-[11px] text-slate-400">{completedCount}</span>
            </button>
          </nav>
        </div>

        {/* 카테고리 필터 */}
        <div>
          <div className="flex items-center justify-between px-2.5 mb-1.5">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              카테고리
            </p>
          </div>
          <div className="space-y-1">
            {CATEGORIES.map((cat) => {
              const count = getCategoryCount(cat);
              const isSelected = selectedCategory === cat && currentView === 'all';
              return (
                <button
                  key={cat}
                  onClick={() => {
                    onSelectView('all');
                    onSelectCategory(cat);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    <span>{cat}</span>
                  </div>
                  {count > 0 && (
                    <span className="text-[11px] px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. 하단 진척도 & 설정 도구 */}
      <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
        {/* 미니 진척도 바 */}
        <div className="bg-white dark:bg-slate-800/80 rounded-xl p-3 border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between mb-1.5 text-xs">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">오늘의 달성률</span>
            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">{percentage}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* 유틸리티 버튼들 */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1">
            <button
              onClick={onOpenBackup}
              title="데이터 백업 및 복원"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onResetData}
              title="초기 샘플 데이터로 복원"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onToggleDarkMode}
            title={darkMode ? '라이트 모드' : '다크 모드'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
          >
            {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-400" />}
            <span className="text-[11px]">{darkMode ? '라이트' : '다크'}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
