-- 1. todos 테이블 생성
CREATE TABLE IF NOT EXISTS public.todos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'medium',
  category TEXT DEFAULT '개인',
  due_date TEXT,
  created_at BIGINT NOT NULL,
  completed_at BIGINT
);

-- 2. Row Level Security (RLS) 활성화
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- 3. 공개 읽기/쓰기/수정/삭제 정책 허용 (개발 및 개인용)
CREATE POLICY "Allow public read" ON public.todos FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.todos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.todos FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.todos FOR DELETE USING (true);

-- 4. 실시간(Realtime) 동기화 활성화 (선택 사항)
ALTER PUBLICATION supabase_realtime ADD TABLE public.todos;

