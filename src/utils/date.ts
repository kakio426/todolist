export function formatKoreanDate(date: Date = new Date()): string {
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = days[date.getDay()];
  return `${year}년 ${month}월 ${day}일 ${dayOfWeek}`;
}

export function getDDayBadge(dueDateStr?: string): { text: string; colorClass: string } | null {
  if (!dueDateStr) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = dueDateStr.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      text: `${Math.abs(diffDays)}일 지남`,
      colorClass: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-900',
    };
  } else if (diffDays === 0) {
    return {
      text: '오늘 마감',
      colorClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-900 animate-pulse',
    };
  } else if (diffDays === 1) {
    return {
      text: 'D-1 (내일)',
      colorClass: 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-400 border border-orange-200 dark:border-orange-900',
    };
  } else {
    return {
      text: `D-${diffDays}`,
      colorClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    };
  }
}

