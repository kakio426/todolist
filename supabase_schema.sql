-- ========================================================
-- 할 일 목록(todos) 테이블 및 사용자별 RLS 보안 정책 설정
-- ========================================================

-- 1. todos 테이블 생성 (user_id 컬럼 포함)
CREATE TABLE IF NOT EXISTS public.todos (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'medium',
  category TEXT DEFAULT '개인',
  due_date TEXT,
  created_at BIGINT NOT NULL,
  completed_at BIGINT
);

-- 혹시 기존에 테이블이 이미 생성되어 있다면 user_id 컬럼 추가
ALTER TABLE public.todos 
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();

-- 2. 기존 임시 공개 정책 삭제 (기존 정책 초기화)
DROP POLICY IF EXISTS "Allow public read" ON public.todos;
DROP POLICY IF EXISTS "Allow public insert" ON public.todos;
DROP POLICY IF EXISTS "Allow public update" ON public.todos;
DROP POLICY IF EXISTS "Allow public delete" ON public.todos;
DROP POLICY IF EXISTS "Users can select own todos" ON public.todos;
DROP POLICY IF EXISTS "Users can insert own todos" ON public.todos;
DROP POLICY IF EXISTS "Users can update own todos" ON public.todos;
DROP POLICY IF EXISTS "Users can delete own todos" ON public.todos;

-- 3. Row Level Security (RLS) 활성화
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- 4. 로그인한 사용자 본인의 데이터만 접근할 수 있는 엄격한 RLS 정책 등록
-- (1) 본인이 작성한 할 일만 조회
CREATE POLICY "Users can select own todos"
  ON public.todos FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- (2) 본인의 user_id로만 할 일 추가 가능
CREATE POLICY "Users can insert own todos"
  ON public.todos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- (3) 본인이 작성한 할 일만 수정 가능
CREATE POLICY "Users can update own todos"
  ON public.todos FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- (4) 본인이 작성한 할 일만 삭제 가능
CREATE POLICY "Users can delete own todos"
  ON public.todos FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 5. 실시간 동기화 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE public.todos;
