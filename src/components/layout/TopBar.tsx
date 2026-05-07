import { useState } from 'react';
import { Link2, Loader2, LayoutGrid, List, Sparkles, ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import type { ViewMode, SortMode } from '@/types';

interface TopBarProps {
  itemCount: number;
  viewMode: ViewMode;
  sortMode: SortMode;
  onViewModeChange: (mode: ViewMode) => void;
  onSortModeChange: (mode: SortMode) => void;
  onAddUrl: (url: string) => Promise<void>;
  onAiSearchOpen: () => void;
  isProcessing: boolean;
}

export default function TopBar({
  itemCount,
  viewMode,
  sortMode: _sortMode,
  onViewModeChange,
  onSortModeChange: _onSortModeChange,
  onAddUrl,
  onAiSearchOpen,
  isProcessing,
}: TopBarProps) {
  void _sortMode;
  void _onSortModeChange;
  const [url, setUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || isProcessing) return;
    await onAddUrl(url.trim());
    setUrl('');
  };

  return (
    <header
      className="flex items-center gap-3 px-4 h-14 border-b flex-shrink-0"
      style={{ borderColor: '#eaeaea', background: '#fff' }}
    >
      {/* Add URL Input */}
      <form onSubmit={handleSubmit} className="flex-1 max-w-xl relative">
        <Link2
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: '#c7c7cc' }}
        />
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="粘贴链接，AI 自动抓取分类..."
          className="w-full pl-9 pr-10 py-2 rounded-lg text-[13px] outline-none transition-all"
          style={{
            background: '#f5f5f7',
            color: '#111',
            border: '1px solid transparent',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#2A4BFF')}
          onBlur={(e) => (e.target.style.borderColor = 'transparent')}
        />
        {isProcessing && (
          <Loader2 size={15} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-[#2A4BFF]" />
        )}
      </form>

      {/* AI Search Quick Button */}
      <button
        onClick={onAiSearchOpen}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] transition-all hover:bg-[#2A4BFF]/10"
        style={{ color: '#2A4BFF' }}
      >
        <Sparkles size={15} />
        <span className="hidden md:inline">AI 搜索</span>
      </button>

      <span className="text-[12px] flex-shrink-0" style={{ color: '#c7c7cc' }}>
        {itemCount} 条
      </span>

      {/* Sort Button */}
      <button
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] transition-all border hover:bg-[#f8f8f9]"
        style={{ color: '#666', borderColor: '#eaeaea' }}
        title="排序"
      >
        <ArrowUpDown size={14} />
        <span className="hidden md:inline">排序</span>
      </button>

      {/* Display Button */}
      <button
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] transition-all border hover:bg-[#f8f8f9]"
        style={{ color: '#666', borderColor: '#eaeaea' }}
        title="显示"
      >
        <SlidersHorizontal size={14} />
        <span className="hidden md:inline">显示</span>
      </button>

      {/* View Mode Toggle */}
      <div className="flex items-center border rounded-lg overflow-hidden" style={{ borderColor: '#eaeaea' }}>
        <button
          onClick={() => onViewModeChange('grid')}
          className="p-2 transition-all"
          style={{ background: viewMode === 'grid' ? '#111' : 'transparent', color: viewMode === 'grid' ? '#fff' : '#999' }}
        >
          <LayoutGrid size={15} />
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          className="p-2 transition-all"
          style={{ background: viewMode === 'list' ? '#111' : 'transparent', color: viewMode === 'list' ? '#fff' : '#999' }}
        >
          <List size={15} />
        </button>
      </div>
    </header>
  );
}
