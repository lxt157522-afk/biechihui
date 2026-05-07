import { FileText, PlayCircle, BookOpen, Star, Trash2, Eye, EyeOff } from 'lucide-react';
import type { CollectionItem, ViewMode } from '@/types';

interface CardGridProps {
  items: CollectionItem[];
  viewMode: ViewMode;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  article: <FileText size={14} />,
  video: <PlayCircle size={14} />,
  doc: <BookOpen size={14} />,
  image: <FileText size={14} />,
};

const TYPE_LABEL: Record<string, string> = {
  article: '文章',
  video: '视频',
  doc: '文档',
  image: '图片',
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return '今天';
  if (days === 1) return '昨天';
  if (days < 7) return `${days}天前`;
  if (days < 30) return `${Math.floor(days / 7)}周前`;
  return `${Math.floor(days / 30)}月前`;
}

export default function CardGrid({
  items,
  viewMode,
  selectedId,
  onSelect,
  onToggleFavorite,
  onToggleRead,
  onDelete,
}: CardGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center" style={{ minHeight: 400 }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#f5f5f7' }}>
          <FileText size={28} style={{ color: '#c7c7cc' }} />
        </div>
        <p className="text-[14px] font-medium" style={{ color: '#999' }}>暂无收藏</p>
        <p className="text-[12px] mt-1" style={{ color: '#c7c7cc' }}>粘贴上方链接开始收藏</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="flex flex-col">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect(item.id)}
            className="group flex items-center gap-4 px-5 py-3.5 border-b cursor-pointer transition-all hover:bg-[#f8f8f9]"
            style={{
              borderColor: '#f0f0f0',
              background: selectedId === item.id ? '#f0f0f0' : 'transparent',
              opacity: item.isRead ? 0.7 : 1,
            }}
          >
            {/* Type icon */}
            <div
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: item.contentType === 'video' ? '#fff3e0' : '#f0f7ff', color: item.contentType === 'video' ? '#f57c00' : '#2A4BFF' }}
            >
              {TYPE_ICON[item.contentType]}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-[13px] font-medium truncate" style={{ color: item.isRead ? '#999' : '#111' }}>
                  {item.title}
                </h3>
                {!item.isRead && (
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: '#2A4BFF' }} />
                )}
              </div>
              <p className="text-[12px] truncate mt-0.5" style={{ color: '#c7c7cc' }}>
                {item.summary}
              </p>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex gap-1">
                {item.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: '#f5f5f7', color: '#999' }}>
                    {tag}
                  </span>
                ))}
              </div>
              <span className="text-[11px]" style={{ color: '#c7c7cc' }}>{item.source}</span>
              <span className="text-[11px]" style={{ color: '#c7c7cc' }}>{timeAgo(item.createdAt)}</span>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.id); }}
                  className="p-1 rounded hover:bg-[#eaeaea] transition-colors"
                >
                  <Star size={13} style={{ color: item.isFavorite ? '#f57c00' : '#c7c7cc' }} fill={item.isFavorite ? '#f57c00' : 'none'} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleRead(item.id); }}
                  className="p-1 rounded hover:bg-[#eaeaea] transition-colors"
                >
                  {item.isRead ? <EyeOff size={13} style={{ color: '#c7c7cc' }} /> : <Eye size={13} style={{ color: '#c7c7cc' }} />}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                  className="p-1 rounded hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={13} style={{ color: '#c7c7cc' }} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Grid view
  return (
    <div className="grid gap-4 p-4" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelect(item.id)}
          className="group card-mono rounded-xl border cursor-pointer transition-all hover:shadow-md"
          style={{
            borderColor: selectedId === item.id ? '#111' : '#eaeaea',
            background: '#fff',
            opacity: item.isRead ? 0.75 : 1,
          }}
        >
          {/* Card header with type badge */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <div className="flex items-center gap-2">
              <span
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                style={{
                  background: item.contentType === 'video' ? '#fff3e0' : '#f0f7ff',
                  color: item.contentType === 'video' ? '#f57c00' : '#2A4BFF',
                }}
              >
                {TYPE_ICON[item.contentType]}
                {TYPE_LABEL[item.contentType]}
              </span>
              <span className="text-[11px]" style={{ color: '#c7c7cc' }}>{item.source}</span>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.id); }}
                className="p-1 rounded hover:bg-[#eaeaea] transition-colors"
              >
                <Star size={13} style={{ color: item.isFavorite ? '#f57c00' : '#c7c7cc' }} fill={item.isFavorite ? '#f57c00' : 'none'} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                className="p-1 rounded hover:bg-red-50 transition-colors"
              >
                <Trash2 size={13} style={{ color: '#c7c7cc' }} />
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="px-4 pb-2">
            <h3 className="text-[13px] font-medium leading-snug line-clamp-2" style={{ color: item.isRead ? '#666' : '#111' }}>
              {item.title}
            </h3>
          </div>

          {/* Summary */}
          <div className="px-4 pb-3">
            <p className="text-[11px] leading-relaxed line-clamp-3" style={{ color: '#999' }}>
              {item.summary}
            </p>
          </div>

          {/* Tags & Footer */}
          <div className="flex items-center justify-between px-4 pb-4">
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: '#f5f5f7', color: '#86868B' }}>
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {!item.isRead && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#2A4BFF' }} />}
              <span className="text-[10px] flex-shrink-0" style={{ color: '#c7c7cc' }}>{timeAgo(item.createdAt)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
