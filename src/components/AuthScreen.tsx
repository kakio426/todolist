import React, { useState } from 'react';
import { CheckCircle2, Lock, Mail, AlertCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { authService } from '../services/authService';

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('이메일과 비밀번호를 모두 입력해 주세요.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('비밀번호는 최소 6자리 이상이어야 합니다.');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        // 회원가입
        const { user, error } = await authService.signUp(email.trim(), password);
        if (error) throw error;

        if (user && user.identities && user.identities.length === 0) {
          setErrorMsg('이미 가입된 이메일 주소입니다.');
        } else {
          setSuccessMsg('회원가입이 완료되었습니다! 로그인되었습니다.');
          onAuthSuccess();
        }
      } else {
        // 로그인
        const { error } = await authService.signIn(email.trim(), password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('이메일 또는 비밀번호가 일치하지 않습니다.');
          }
          throw error;
        }
        onAuthSuccess();
      }
    } catch (err: any) {
      setErrorMsg(err.message || '인증 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <div className="w-full max-w-md">
        {/* 상단 브랜딩 */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            오늘의 할 일
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            로그인하여 나만의 안전한 클라우드 할 일 목록을 관리하세요.
          </p>
        </div>

        {/* 인증 카드 */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-7 shadow-xl shadow-slate-200/50 dark:shadow-none">
          {/* 탭 전환 (로그인 / 회원가입) */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 text-xs font-semibold rounded-xl transition ${
                !isSignUp
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              로그인
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 text-xs font-semibold rounded-xl transition ${
                isSignUp
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              새 계정 만들기
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 이메일 입력 */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                이메일 주소
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="최소 6자리 이상"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            {/* 오류 메시지 */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 성공 메시지 */}
            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium text-sm flex items-center justify-center gap-2 transition shadow-md shadow-indigo-600/25 mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? '회원가입 완료' : '로그인'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* 안내 */}
          <div className="mt-5 text-center text-xs text-slate-400">
            {isSignUp ? (
              <p>
                이미 계정이 있으신가요?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  로그인하기
                </button>
              </p>
            ) : (
              <p>
                아직 계정이 없으신가요?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  무료로 시작하기
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
