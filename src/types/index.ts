export interface CollectionItem {
  id: string;
  url: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  source: string;
  thumbnail: string;
  contentType: 'article' | 'video' | 'image' | 'doc';
  createdAt: number;
  isRead: boolean;
  isFavorite: boolean;
  fullContent?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export type ViewMode = 'grid' | 'list';
export type SortMode = 'newest' | 'oldest' | 'unread';
