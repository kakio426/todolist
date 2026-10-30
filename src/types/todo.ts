export type Priority = 'low' | 'medium' | 'high';

export type Category = '개인' | '업무' | '공부' | '건강' | '기타';

export interface Todo {
  id: string;
  userId?: string;
  title: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  dueDate?: string; // YYYY-MM-DD
  createdAt: number;
  completedAt?: number;
}

export type FilterStatus = 'all' | 'active' | 'completed';

export type SortOption = 'createdAt-desc' | 'createdAt-asc' | 'dueDate-asc' | 'priority-desc';
