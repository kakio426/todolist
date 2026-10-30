import React from 'react';
import { CheckCircle2, Moon, Sun, Download, RefreshCw } from 'lucide-react';
import { formatKoreanDate } from '../utils/date';

interface HeaderProps {
  completedCount: number;
  totalCount: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenBackup: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  completedCount,
  totalCount,
  darkMode,
  onToggleDarkMode,
  onOpenBackup,
  onResetData,
}) => {
  const percentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <header className="mb-8">
      {/* 탑 네비게이션 / 유틸리티 */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              오늘의 할 일
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {formatKoreanDate()}
            </p>
          </div>
        </div>

        {/* 우측 도구 버튼들 */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onOpenBackup}
            title="데이터 백업 및 복원"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={onResetData}
            title="기본 샘플 데이터로 초기화"
            className="p-2 rounded-lg text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleDarkMode}
            title={darkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
            className="p-2 rounded-lg text-slate-500 hover:text-amber-500 dark:text-slate-400 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 진척도 대시보드 카드 */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              오늘의 달성률
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-medium">
              {completedCount} / {totalCount} 완료
            </span>
          </div>
          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
            {percentage}%
          </span>
        </div>

        {/* 프로그레스 바 */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {totalCount > 0 && percentage === 100 && (
          <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 animate-fade-in">
            🎉 오늘 계획된 모든 할 일을 마쳤습니다! 훌륭해요!
          </p>
        )}
      </div>
    </header>
  );
};

