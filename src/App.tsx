import { useState, useEffect, useMemo, useCallback } from 'react';
import { Sidebar, SmartView } from './components/Sidebar';
import { MainHeader } from './components/MainHeader';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { BackupModal } from './components/BackupModal';
import { AuthScreen } from './components/AuthScreen';
import { Todo, Priority, Category, SortOption } from './types/todo';
import { todoService } from './services/todoService';
import { authService } from './services/authService';
import { User } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';

const STORAGE_KEY_PREFIX = 'user_todo_data_';
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

  // 인증 사용자 상태
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // 투두 리스트 데이터
  const [todos, setTodos] = useState<Todo[]>([]);
  const isDbConnected = todoService.isConfigured();

  // 사용자별 localStorage 키
  const userStorageKey = useMemo(() => {
    return user ? `${STORAGE_KEY_PREFIX}${user.id}` : null;
  }, [user]);

  // 초기 인증 세션 확인 및 구독
  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const currentUser = await authService.getCurrentUser();
        if (isMounted) {
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Auth check error:', err);
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    }

    checkAuth();

    const { unsubscribe } = authService.onAuthStateChange((newUser) => {
      setUser(newUser);
      setAuthLoading(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // 사용자 로그인 시 투두 목록 로드
  const loadTodos = useCallback(async () => {
    if (!user) {
      setTodos([]);
      return;
    }

    if (isDbConnected) {
      try {
        const dbTodos = await todoService.fetchTodos();
        setTodos(dbTodos);
        return;
      } catch (err) {
        console.warn('Supabase fetch failed, fallback to local storage:', err);
      }
    }

    // 로컬 스토리지 Fallback (사용자별)
    if (userStorageKey) {
      try {
        const saved = localStorage.getItem(userStorageKey);
        if (saved) {
          setTodos(JSON.parse(saved));
          return;
        }
      } catch (e) {
        console.error('Failed to parse saved todos', e);
      }
    }

    // 신규 사용자의 경우 초기 비어있는 리스트
    setTodos([]);
  }, [user, isDbConnected, userStorageKey]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  // 투두 변경 시 사용자별 로컬 스토리지에 캐시
  useEffect(() => {
    if (userStorageKey && todos.length >= 0) {
      localStorage.setItem(userStorageKey, JSON.stringify(todos));
    }
  }, [todos, userStorageKey]);

  // 사이드바 네비게이션 상태
  const [currentView, setCurrentView] = useState<SmartView>('all');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('createdAt-desc');
  const [searchQuery, setSearchQuery] = useState('');

  // 백업 모달
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  // 로그아웃 처리
  const handleSignOut = async () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      await authService.signOut();
      setUser(null);
      setTodos([]);
    }
  };

  // 투두 추가 (로그인한 user_id 전달)
  const handleAddTodo = async (title: string, priority: Priority, category: Category, dueDate?: string) => {
    if (!user) return;

    const defaultCat = selectedCategory !== 'all' ? selectedCategory : category;
    const newTodo: Todo = {
      id: `todo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      userId: user.id,
      title,
      completed: false,
      priority,
      category: defaultCat,
      dueDate,
      createdAt: Date.now(),
    };

    setTodos((prev) => [newTodo, ...prev]);

    if (isDbConnected) {
      try {
        await todoService.addTodo(newTodo, user.id);
      } catch (err) {
        console.error('DB insert error:', err);
      }
    }
  };

  // 완료 여부 토글
  const handleToggle = async (id: string) => {
    const target = todos.find((t) => t.id === id);
    if (!target) return;

    const nextCompleted = !target.completed;
    const updated: Todo = {
      ...target,
      completed: nextCompleted,
      completedAt: nextCompleted ? Date.now() : undefined,
    };

    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));

    if (isDbConnected) {
      try {
        await todoService.updateTodo(updated);
      } catch (err) {
        console.error('DB update error:', err);
      }
    }
  };

  // 삭제
  const handleDelete = async (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    if (isDbConnected) {
      try {
        await todoService.deleteTodo(id);
      } catch (err) {
        console.error('DB delete error:', err);
      }
    }
  };

  // 제목 수정
  const handleEdit = async (id: string, newTitle: string) => {
    const target = todos.find((t) => t.id === id);
    if (!target) return;

    const updated = { ...target, title: newTitle };
    setTodos((prev) => prev.map((todo) => (todo.id === id ? updated : todo)));

    if (isDbConnected) {
      try {
        await todoService.updateTodo(updated);
      } catch (err) {
        console.error('DB update error:', err);
      }
    }
  };

  // 완료된 항목 일괄 삭제
  const handleClearCompleted = async () => {
    if (window.confirm('완료된 모든 할 일을 목록에서 삭제하시겠습니까?')) {
      setTodos((prev) => prev.filter((todo) => !todo.completed));
      if (isDbConnected) {
        try {
          await todoService.clearCompleted();
        } catch (err) {
          console.error('DB clear completed error:', err);
        }
      }
    }
  };

  // 데이터 초기화
  const handleResetData = () => {
    if (window.confirm('현재 사용자의 할 일 목록을 비우시겠습니까?')) {
      setTodos([]);
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

  const completedInView = useMemo(
    () => filteredAndSortedTodos.filter((t) => t.completed).length,
    [filteredAndSortedTodos]
  );
  const activeInView = useMemo(
    () => filteredAndSortedTodos.filter((t) => !t.completed).length,
    [filteredAndSortedTodos]
  );

  // 1. 초기 세션 확인 중 로딩 화면
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // 2. 로그인되지 않은 경우 -> 로그인/회원가입 화면으로 전환
  if (!user) {
    return <AuthScreen onAuthSuccess={() => loadTodos()} />;
  }

  // 3. 로그인된 사용자 -> 메인 대시보드 및 할 일 목록 표시
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
        user={user}
        onSignOut={handleSignOut}
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
            isDbConnected={isDbConnected}
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
