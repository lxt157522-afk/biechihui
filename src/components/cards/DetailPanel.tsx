import { X, ExternalLink, Star, Trash2, Eye, EyeOff, FileText, PlayCircle, BookOpen, Tag, Clock, Globe } from 'lucide-react';
import type { CollectionItem } from '@/types';

interface DetailPanelProps {
  item: CollectionItem | null;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; label: string; bg: string; color: string }> = {
  article: { icon: <FileText size={14} />, label: '文章', bg: '#f0f7ff', color: '#2A4BFF' },
  video: { icon: <PlayCircle size={14} />, label: '视频', bg: '#fff3e0', color: '#f57c00' },
  doc: { icon: <BookOpen size={14} />, label: '文档', bg: '#f0fff4', color: '#22c55e' },
  image: { icon: <FileText size={14} />, label: '图片', bg: '#f5f5f7', color: '#666' },
};

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function DetailPanel({
  item,
  onClose,
  onToggleFavorite,
  onToggleRead,
  onDelete,
}: DetailPanelProps) {
  if (!item) return null;

  const tc = TYPE_CONFIG[item.contentType] || TYPE_CONFIG.article;

  return (
    <aside
      className="flex flex-col h-full border-l"
      style={{
        width: 400,
        borderColor: '#eaeaea',
        background: '#fff',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 h-14 border-b flex-shrink-0" style={{ borderColor: '#eaeaea' }}>
        <span className="text-[12px] font-medium" style={{ color: '#c7c7cc' }}>收藏详情</span>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-[#f5f5f7] transition-colors"
        >
          <X size={16} style={{ color: '#999' }} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Type & Source */}
        <div className="px-5 pt-5 pb-4 flex items-center gap-2">
          <span
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
            style={{ background: tc.bg, color: tc.color }}
          >
            {tc.icon}
            {tc.label}
          </span>
          <span className="flex items-center gap-1 text-[11px]" style={{ color: '#c7c7cc' }}>
            <Globe size={11} />
            {item.source}
          </span>
        </div>

        {/* Title */}
        <div className="px-5 pb-4">
          <h2 className="text-[17px] font-semibold leading-snug" style={{ color: '#111' }}>
            {item.title}
          </h2>
        </div>

        {/* AI Summary */}
        <div className="px-5 pb-5">
          <div className="rounded-xl p-4" style={{ background: '#f8f8f9' }}>
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-4 h-4 rounded-full bg-[#2A4BFF] flex items-center justify-center">
                <span className="text-[8px] text-white font-bold">AI</span>
              </div>
              <span className="text-[11px] font-medium" style={{ color: '#2A4BFF' }}>AI 摘要</span>
            </div>
            <p className="text-[13px] leading-relaxed" style={{ color: '#666' }}>
              {item.summary}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="px-5 pb-5">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Tag size={13} style={{ color: '#c7c7cc' }} />
            <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: '#c7c7cc' }}>标签</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-[12px] font-medium"
                style={{ background: '#f0f7ff', color: '#2A4BFF' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Meta */}
        <div className="px-5 pb-5">
          <div className="flex items-center gap-1.5 mb-2">
            <Clock size={13} style={{ color: '#c7c7cc' }} />
            <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: '#c7c7cc' }}>信息</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[12px]">
              <span style={{ color: '#999' }}>收藏时间</span>
              <span style={{ color: '#666' }}>{formatDate(item.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span style={{ color: '#999' }}>阅读状态</span>
              <span style={{ color: item.isRead ? '#22c55e' : '#2A4BFF' }}>
                {item.isRead ? '已读' : '未读'}
              </span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span style={{ color: '#999' }}>原始链接</span>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:underline"
                style={{ color: '#2A4BFF' }}
                onClick={(e) => e.stopPropagation()}
              >
                访问 <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>

        {/* Full content preview */}
        {item.fullContent && (
          <div className="px-5 pb-5">
            <div className="flex items-center gap-1.5 mb-2">
              <FileText size={13} style={{ color: '#c7c7cc' }} />
              <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: '#c7c7cc' }}>内容预览</span>
            </div>
            <div className="rounded-lg p-4 text-[13px] leading-relaxed" style={{ background: '#f8f8f9', color: '#666' }}>
              {item.fullContent}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center gap-2 px-5 py-3 border-t flex-shrink-0" style={{ borderColor: '#eaeaea' }}>
        <button
          onClick={() => onToggleFavorite(item.id)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium transition-all hover:bg-[#f5f5f7]"
          style={{ color: item.isFavorite ? '#f57c00' : '#999' }}
        >
          <Star size={14} fill={item.isFavorite ? '#f57c00' : 'none'} />
          {item.isFavorite ? '已星标' : '星标'}
        </button>
        <button
          onClick={() => onToggleRead(item.id)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium transition-all hover:bg-[#f5f5f7]"
          style={{ color: '#999' }}
        >
          {item.isRead ? <EyeOff size={14} /> : <Eye size={14} />}
          {item.isRead ? '标记未读' : '标记已读'}
        </button>
        <div className="flex-1" />
        <button
          onClick={() => { onDelete(item.id); onClose(); }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium transition-all hover:bg-red-50"
          style={{ color: '#ef4444' }}
        >
          <Trash2 size={14} />
          删除
        </button>
      </div>
    </aside>
  );
}
