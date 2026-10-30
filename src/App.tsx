import { useState, useEffect, useMemo } from 'react';
import { Sidebar, SmartView } from './components/Sidebar';
import { MainHeader } from './components/MainHeader';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { BackupModal } from './components/BackupModal';
import { Todo, Priority, Category, SortOption } from './types/todo';
import { INITIAL_TODOS } from './constants/initialData';

const STORAGE_KEY = 'minimal_todo_data_v1';
const THEME_KEY = 'todo_theme_mode';

export default function App() {
  // 테마 설정 (다크 모드)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved !== null) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [darkMode]);

  // 투두 리스트 데이터
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved todos', e);
    }
    return INITIAL_TODOS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  // 사이드바 네비게이션 상태
  const [currentView, setCurrentView] = useState<SmartView>('all');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('createdAt-desc');
  const [searchQuery, setSearchQuery] = useState('');

  // 백업 모달
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  // 투두 추가 (선택된 카테고리가 있다면 기본 카테고리로 적용 가능)
  const handleAddTodo = (title: string, priority: Priority, category: Category, dueDate?: string) => {
    const defaultCat = selectedCategory !== 'all' ? selectedCategory : category;
    const newTodo: Todo = {
      id: `todo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title,
      completed: false,
      priority,
      category: defaultCat,
      dueDate,
      createdAt: Date.now(),
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  // 완료 여부 토글
  const handleToggle = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === id) {
          const nextCompleted = !todo.completed;
          return {
            ...todo,
            completed: nextCompleted,
            completedAt: nextCompleted ? Date.now() : undefined,
          };
        }
        return todo;
      })
    );
  };

  // 삭제
  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  // 제목 수정
  const handleEdit = (id: string, newTitle: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, title: newTitle } : todo))
    );
  };

  // 완료된 항목 일괄 삭제
  const handleClearCompleted = () => {
    if (window.confirm('완료된 모든 할 일을 목록에서 삭제하시겠습니까?')) {
      setTodos((prev) => prev.filter((todo) => !todo.completed));
    }
  };

  // 기본 샘플 데이터 초기화
  const handleResetData = () => {
    if (window.confirm('초기 샘플 데이터로 되돌리시겠습니까? 현재 데이터가 덮어씌워집니다.')) {
      setTodos(INITIAL_TODOS);
      setCurrentView('all');
      setSelectedCategory('all');
    }
  };

  // 백업 데이터 가져오기
  const handleImport = (importedTodos: Todo[]) => {
    setTodos(importedTodos);
  };

  // 날짜 스트링 (오늘)
  const todayStr = new Date().toISOString().split('T')[0];

  // 필터링 및 정렬 적용
  const filteredAndSortedTodos = useMemo(() => {
    return todos
      .filter((todo) => {
        // 1. 스마트 뷰 필터
        if (currentView === 'today') {
          if (todo.dueDate !== todayStr) return false;
        } else if (currentView === 'important') {
          if (todo.priority !== 'high') return false;
        } else if (currentView === 'completed') {
          if (!todo.completed) return false;
        }

        // 2. 카테고리 필터
        if (selectedCategory !== 'all' && todo.category !== selectedCategory) {
          return false;
        }

        // 3. 검색어 필터
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          return todo.title.toLowerCase().includes(query);
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'createdAt-desc') return b.createdAt - a.createdAt;
        if (sortBy === 'createdAt-asc') return a.createdAt - b.createdAt;
        if (sortBy === 'dueDate-asc') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        }
        if (sortBy === 'priority-desc') {
          const rank: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
          return rank[b.priority] - rank[a.priority];
        }
        return 0;
      });
  }, [todos, currentView, selectedCategory, searchQuery, sortBy, todayStr]);

  const completedInView = useMemo(() => filteredAndSortedTodos.filter((t) => t.completed).length, [filteredAndSortedTodos]);
  const activeInView = useMemo(() => filteredAndSortedTodos.filter((t) => !t.completed).length, [filteredAndSortedTodos]);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* 💻 좌측 고정 사이드바 */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        todos={todos}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        onOpenBackup={() => setIsBackupOpen(true)}
        onResetData={handleResetData}
      />

      {/* 🖥️ 우측 메인 작업 영역 */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
        <main className="max-w-4xl w-full mx-auto px-6 lg:px-10 py-8">
          {/* 상단 뷰 타이틀, 날짜, 검색 및 정렬 바 */}
          <MainHeader
            currentView={currentView}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            itemCount={filteredAndSortedTodos.length}
          />

          {/* 할 일 빠른 추가 입력창 */}
          <div className="mb-6">
            <TodoInput onAddTodo={handleAddTodo} />
          </div>

          {/* 할 일 목록 */}
          <TodoList
            todos={filteredAndSortedTodos}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onClearCompleted={handleClearCompleted}
            completedCount={completedInView}
            activeCount={activeInView}
          />
        </main>
      </div>

      {/* 백업/복원 모달 */}
      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        todos={todos}
        onImport={handleImport}
      />
    </div>
  );
}
