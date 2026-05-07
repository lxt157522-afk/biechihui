import {
  Inbox, Circle, Star, FileText, PlayCircle, Code, Palette, Zap,
  TrendingUp, Coffee, Search, Hash,
} from 'lucide-react';
import type { Category } from '@/types';

const ICON_MAP: Record<string, React.ReactNode> = {
  inbox: <Inbox size={18} />,
  circle: <Circle size={18} />,
  star: <Star size={18} />,
  'file-text': <FileText size={18} />,
  'play-circle': <PlayCircle size={18} />,
  code: <Code size={18} />,
  palette: <Palette size={18} />,
  zap: <Zap size={18} />,
  'trending-up': <TrendingUp size={18} />,
  coffee: <Coffee size={18} />,
};

interface SidebarProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  allTags: string[];
  onTagClick: (tag: string) => void;
  onSearchOpen: () => void;
}

export default function Sidebar({
  categories,
  activeCategory,
  onCategoryChange,
  allTags,
  onTagClick,
  onSearchOpen,
}: SidebarProps) {
  return (
    <aside
      className="flex flex-col h-full border-r select-none"
      style={{
        width: 220,
        background: '#f8f8f9',
        borderColor: '#eaeaea',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 h-14 border-b" style={{ borderColor: '#eaeaea' }}>
        <div className="w-[22px] h-[22px] rounded-md bg-[#111] flex items-center justify-center flex-shrink-0">
          <Inbox size={13} className="text-white" />
        </div>
        <span className="logo-serif text-[15px] font-semibold text-[#111] leading-[22px]">别吃灰</span>
      </div>

      {/* AI Search Button */}
      <div className="px-4 pt-4 pb-2">
        <button
          onClick={onSearchOpen}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm text-[#86868B] border transition-all hover:border-[#2A4BFF] hover:text-[#2A4BFF] hover:bg-[#2A4BFF]/5"
          style={{ borderColor: '#e0e0e0', background: '#fff' }}
        >
          <Search size={16} />
          <span>AI 语义搜索...</span>
          <span className="ml-auto text-[11px] text-[#c7c7cc] font-medium">⌘K</span>
        </button>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <div className="mb-1 px-3">
          <span className="text-[11px] font-medium text-[#c7c7cc] uppercase tracking-wider">收藏夹</span>
        </div>
        <nav className="space-y-0.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className="w-full flex items-center px-3 py-2 rounded-lg text-[13px] transition-all"
              style={{
                background: activeCategory === cat.id ? '#111' : 'transparent',
                color: activeCategory === cat.id ? '#fff' : '#666',
              }}
            >
              <span className="flex-shrink-0 opacity-70 w-[18px] flex items-center justify-center">
                {ICON_MAP[cat.icon] || <Inbox size={18} />}
              </span>
              <span className="ml-3 text-left">{cat.name}</span>
              <span className="flex-1" />
              {cat.count > 0 && (
                <span
                  className="count-georgia text-[11px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0 text-right"
                  style={{
                    background: activeCategory === cat.id ? 'rgba(255,255,255,0.15)' : '#eaeaea',
                    color: activeCategory === cat.id ? 'rgba(255,255,255,0.8)' : '#999',
                  }}
                >
                  {cat.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Tags */}
        {allTags.length > 0 && (
          <>
            <div className="mt-5 mb-2 px-3 flex items-center gap-1.5">
              <Hash size={12} className="text-[#c7c7cc]" />
              <span className="text-[11px] font-medium text-[#c7c7cc] uppercase tracking-wider">标签</span>
            </div>
            <div className="flex flex-wrap gap-2 px-3">
              {allTags.slice(0, 12).map((tag) => (
                <button
                  key={tag}
                  onClick={() => onTagClick(tag)}
                  className="px-2.5 py-1 rounded-full text-[11px] transition-all hover:bg-[#111] hover:text-white"
                  style={{ background: '#fff', color: '#999', border: '1px solid #e0e0e0' }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bottom info */}
      <div className="px-5 py-3 border-t text-[11px] text-[#c7c7cc]" style={{ borderColor: '#eaeaea' }}>
        <span>AI 自动分类 · 语义搜索</span>
      </div>
    </aside>
  );
}
