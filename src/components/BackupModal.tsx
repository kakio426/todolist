import React, { useState } from 'react';
import { X, Download, Upload, AlertTriangle } from 'lucide-react';
import { Todo } from '../types/todo';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  todos: Todo[];
  onImport: (todos: Todo[]) => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  todos,
  onImport,
}) => {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(todos, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `todos_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImport = () => {
    try {
      if (!jsonText.trim()) {
        setError('복원할 JSON 데이터를 입력해 주세요.');
        return;
      }
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('유효한 할 일 목록 배열 형식이 아닙니다.');
      }
      onImport(parsed);
      setJsonText('');
      setError(null);
      onClose();
    } catch (err: any) {
      setError(err.message || 'JSON 형식이 잘못되었습니다.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (!Array.isArray(parsed)) {
          throw new Error('유효한 할 일 목록 형식이 아닙니다.');
        }
        onImport(parsed);
        setError(null);
        onClose();
      } catch (err: any) {
        setError(err.message || '파일을 읽는 중 오류가 발생했습니다.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 p-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-base">
            데이터 백업 및 복원
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 py-4 text-xs">
          {/* 내보내기 */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-700 dark:text-slate-200">할 일 데이터 백업 (JSON)</p>
              <p className="text-slate-400">현재 저장된 {todos.length}개의 할 일을 파일로 저장합니다.</p>
            </div>
            <button
              onClick={handleExport}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center gap-1 shadow-sm shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>다운로드</span>
            </button>
          </div>

          {/* 가져오기 파일 */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-200 mb-1.5">
              백업 파일 가져오기
            </label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="w-full text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-indigo-50 file:text-indigo-700 dark:file:bg-indigo-950 dark:file:text-indigo-400 cursor-pointer"
            />
          </div>

          {/* 또는 텍스트 붙여넣기 */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-200 mb-1.5">
              또는 JSON 텍스트 직접 입력
            </label>
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder='[ { "title": "할 일", ... } ]'
              rows={4}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono text-xs outline-none focus:border-indigo-500"
            />
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs"
          >
            취소
          </button>
          <button
            onClick={handleImport}
            disabled={!jsonText.trim()}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-medium text-xs flex items-center gap-1 shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>가져오기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

