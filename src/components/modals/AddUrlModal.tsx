import { useState, useEffect, useRef } from 'react';
import { Link2, Loader2, Sparkles, Check, X } from 'lucide-react';
import type { CollectionItem } from '@/types';

interface AddUrlModalProps {
  open: boolean;
  onClose: () => void;
  isProcessing: boolean;
  newItem: CollectionItem | null;
  onSubmit: (url: string) => void;
}

export default function AddUrlModal({
  open,
  onClose,
  isProcessing,
  newItem,
  onSubmit,
}: AddUrlModalProps) {
  const [url, setUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setUrl('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || isProcessing) return;
    onSubmit(url.trim());
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden" style={{ background: '#fff' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#eaeaea' }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#2A4BFF] flex items-center justify-center">
              <Link2 size={14} className="text-white" />
            </div>
            <span className="text-[15px] font-semibold" style={{ color: '#111' }}>添加收藏</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#f5f5f7] transition-colors">
            <X size={16} style={{ color: '#c7c7cc' }} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {!newItem ? (
            <form onSubmit={handleSubmit}>
              <label className="text-[12px] font-medium uppercase tracking-wider block mb-2" style={{ color: '#c7c7cc' }}>
                链接地址
              </label>
              <div className="relative">
                <Link2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#c7c7cc' }} />
                <input
                  ref={inputRef}
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-[14px] outline-none transition-all"
                  style={{
                    background: '#f5f5f7',
                    color: '#111',
                    border: '1.5px solid transparent',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#2A4BFF')}
                  onBlur={(e) => (e.target.style.borderColor = 'transparent')}
                  disabled={isProcessing}
                />
              </div>
              <p className="text-[11px] mt-2" style={{ color: '#c7c7cc' }}>
                支持文章、视频、文档等多种格式
              </p>

              <div className="mt-5 flex justify-end">
                <button
                  type="submit"
                  disabled={!url.trim() || isProcessing}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-medium text-white transition-all disabled:opacity-40"
                  style={{ background: '#111' }}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      AI 处理中...
                    </>
                  ) : (
                    <>
                      <Sparkles size={15} />
                      AI 自动抓取
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div>
              {/* Success result */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <Check size={14} style={{ color: '#22c55e' }} />
                </div>
                <span className="text-[13px] font-medium" style={{ color: '#22c55e' }}>AI 抓取完成</span>
              </div>

              <div className="rounded-xl p-4 border" style={{ background: '#f8f8f9', borderColor: '#eaeaea' }}>
                <h3 className="text-[14px] font-semibold mb-1" style={{ color: '#111' }}>
                  {newItem.title}
                </h3>
                <p className="text-[12px] leading-relaxed mb-3" style={{ color: '#666' }}>
                  {newItem.summary}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {newItem.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-0.5 rounded-full text-[11px] font-medium" style={{ background: '#f0f7ff', color: '#2A4BFF' }}>
                      {tag}
                    </span>
                  ))}
                  <span className="px-2.5 py-0.5 rounded-full text-[11px]" style={{ background: '#fff3e0', color: '#f57c00' }}>
                    {newItem.source}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-[13px] font-medium text-white"
                  style={{ background: '#111' }}
                >
                  完成
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
