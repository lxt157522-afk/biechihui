import { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, X, Loader2, ArrowRight } from 'lucide-react';
import type { CollectionItem } from '@/types';

interface AISearchModalProps {
  open: boolean;
  onClose: () => void;
  items: CollectionItem[];
  results: { id: string; relevance: number; reason: string }[] | null;
  isProcessing: boolean;
  onSearch: (query: string) => void;
  onSelectItem: (id: string) => void;
}

const EXAMPLE_QUERIES = [
  '帮我找关于编程的收藏',
  '最近收藏的 AI 相关文章',
  '提高工作效率的方法',
  '设计相关的灵感',
];

export default function AISearchModal({
  open,
  onClose,
  items,
  results,
  isProcessing,
  onSearch,
  onSelectItem,
}: AISearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [open]);

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isProcessing) return;
    onSearch(query.trim());
  };

  const handleResultClick = (id: string) => {
    onSelectItem(id);
    onClose();
  };

  const resultItems = results
    ? results
        .map((r) => ({ ...r, item: items.find((i) => i.id === r.id) }))
        .filter((r) => r.item)
    : [];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: '#fff' }}
      >
        {/* Search Input */}
        <form onSubmit={handleSubmit} className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: '#eaeaea' }}>
          {isProcessing ? (
            <Loader2 size={20} className="animate-spin flex-shrink-0" style={{ color: '#2A4BFF' }} />
          ) : (
            <Sparkles size={20} className="flex-shrink-0" style={{ color: '#2A4BFF' }} />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="用自然语言描述你想找的内容..."
            className="flex-1 text-[15px] outline-none bg-transparent"
            style={{ color: '#111' }}
            disabled={isProcessing}
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#f5f5f7] transition-colors flex-shrink-0"
          >
            <X size={16} style={{ color: '#c7c7cc' }} />
          </button>
        </form>

        {/* Content */}
        <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
          {/* Results */}
          {results && resultItems.length > 0 && (
            <div className="py-2">
              <div className="px-5 py-2 flex items-center gap-2">
                <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: '#c7c7cc' }}>
                  找到 {resultItems.length} 条相关收藏
                </span>
              </div>
              {resultItems.map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleResultClick(r.id)}
                  className="w-full text-left px-5 py-3 hover:bg-[#f8f8f9] transition-colors border-b"
                  style={{ borderColor: '#f5f5f5' }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold"
                        style={{
                          background: r.relevance > 70 ? '#f0f7ff' : '#f5f5f7',
                          color: r.relevance > 70 ? '#2A4BFF' : '#999',
                        }}
                      >
                        {r.relevance}%
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[13px] font-medium truncate" style={{ color: '#111' }}>
                        {r.item!.title}
                      </h4>
                      <p className="text-[11px] mt-0.5" style={{ color: '#2A4BFF' }}>
                        {r.reason}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {r.item!.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: '#f5f5f7', color: '#999' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ArrowRight size={14} className="flex-shrink-0 mt-1" style={{ color: '#c7c7cc' }} />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No results */}
          {results && resultItems.length === 0 && (
            <div className="py-12 text-center">
              <Search size={32} style={{ color: '#e0e0e0' }} className="mx-auto mb-3" />
              <p className="text-[14px] font-medium" style={{ color: '#999' }}>未找到相关内容</p>
              <p className="text-[12px] mt-1" style={{ color: '#c7c7cc' }}>试试其他关键词</p>
            </div>
          )}

          {/* Initial state - suggestions */}
          {!results && !isProcessing && (
            <div className="py-4">
              <div className="px-5 pb-2">
                <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: '#c7c7cc' }}>
                  试试这样说
                </span>
              </div>
              {EXAMPLE_QUERIES.map((q) => (
                <button
                  key={q}
                  onClick={() => { setQuery(q); onSearch(q); }}
                  className="w-full text-left px-5 py-2.5 hover:bg-[#f8f8f9] transition-colors flex items-center gap-3"
                >
                  <Search size={14} style={{ color: '#c7c7cc' }} />
                  <span className="text-[13px]" style={{ color: '#666' }}>{q}</span>
                </button>
              ))}
            </div>
          )}

          {/* Processing */}
          {isProcessing && !results && (
            <div className="py-12 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Loader2 size={18} className="animate-spin" style={{ color: '#2A4BFF' }} />
                <span className="text-[13px]" style={{ color: '#666' }}>AI 正在理解你的意图...</span>
              </div>
              <p className="text-[11px]" style={{ color: '#c7c7cc' }}>分析语义关联度 · 匹配知识库标签</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-2.5 border-t" style={{ borderColor: '#eaeaea', background: '#f8f8f9' }}>
          <span className="text-[10px]" style={{ color: '#c7c7cc' }}>AI 语义搜索 · 自然语言理解</span>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ background: '#eaeaea', color: '#999' }}>ESC 关闭</span>
        </div>
      </div>
    </div>
  );
}
