import { Todo } from '../types/todo';

export const INITIAL_TODOS: Todo[] = [
  {
    id: 'sample-1',
    title: '할 일 목록 앱 둘러보고 첫 작업 완료해보기',
    completed: true,
    priority: 'high',
    category: '개인',
    dueDate: new Date().toISOString().split('T')[0],
    createdAt: Date.now() - 3600000 * 2,
    completedAt: Date.now() - 1800000,
  },
  {
    id: 'sample-2',
    title: '내일 해야 할 중요한 프로젝트 기획안 검토',
    completed: false,
    priority: 'high',
    category: '업무',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    createdAt: Date.now() - 1800000,
  },
  {
    id: 'sample-3',
    title: '매일 30분씩 책 읽기 및 학습 노트 정리',
    completed: false,
    priority: 'medium',
    category: '공부',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    createdAt: Date.now() - 900000,
  },
  {
    id: 'sample-4',
    title: '가벼운 유산소 운동 또는 스트레칭 20분',
    completed: false,
    priority: 'low',
    category: '건강',
    createdAt: Date.now() - 300000,
  },
];

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; darkBg: string; darkText: string }> = {
  '개인': { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'text-emerald-700', darkBg: 'dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800', darkText: 'dark:text-emerald-400' },
  '업무': { bg: 'bg-blue-50 text-blue-700 border-blue-200', text: 'text-blue-700', darkBg: 'dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800', darkText: 'dark:text-blue-400' },
  '공부': { bg: 'bg-purple-50 text-purple-700 border-purple-200', text: 'text-purple-700', darkBg: 'dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800', darkText: 'dark:text-purple-400' },
  '건강': { bg: 'bg-rose-50 text-rose-700 border-rose-200', text: 'text-rose-700', darkBg: 'dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800', darkText: 'dark:text-rose-400' },
  '기타': { bg: 'bg-gray-100 text-gray-700 border-gray-200', text: 'text-gray-700', darkBg: 'dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700', darkText: 'dark:text-gray-400' },
};

