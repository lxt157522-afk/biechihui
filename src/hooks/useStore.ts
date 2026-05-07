import { useState, useCallback, useMemo } from 'react';
import { trpc } from '@/providers/trpc';
import type { CollectionItem, ViewMode, SortMode } from '@/types';
import { loadItems, saveItems, updateItem, deleteItem, getCategories, getAllTags } from '@/store/data';

export function useStore() {
  const [items, setItems] = useState<CollectionItem[]>(loadItems);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [aiSearchOpen, setAiSearchOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResults, setAiResults] = useState<{ id: string; relevance: number; reason: string }[] | null>(null);

  const categories = useMemo(() => getCategories(items), [items]);
  const allTags = useMemo(() => getAllTags(items), [items]);

  // tRPC mutations
  const processUrlMutation = trpc.ai.processUrl.useMutation();
  const searchMutation = trpc.ai.search.useMutation();

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (activeCategory !== 'all') {
      switch (activeCategory) {
        case 'unread': result = result.filter((i) => !i.isRead); break;
        case 'favorite': result = result.filter((i) => i.isFavorite); break;
        case 'article': result = result.filter((i) => i.contentType === 'article'); break;
        case 'video': result = result.filter((i) => i.contentType === 'video'); break;
        default: result = result.filter((i) => i.category === activeCategory);
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.summary.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q)) ||
          i.source.toLowerCase().includes(q)
      );
    }

    switch (sortMode) {
      case 'newest': result.sort((a, b) => b.createdAt - a.createdAt); break;
      case 'oldest': result.sort((a, b) => a.createdAt - b.createdAt); break;
      case 'unread': result.sort((a, b) => (a.isRead === b.isRead ? 0 : a.isRead ? 1 : -1)); break;
    }

    return result;
  }, [items, activeCategory, searchQuery, sortMode]);

  const selectedItem = useMemo(
    () => items.find((i) => i.id === selectedId) || null,
    [items, selectedId]
  );

  const handleAddUrl = useCallback(async (url: string) => {
    setIsProcessing(true);
    try {
      const aiResult = await processUrlMutation.mutateAsync({ url });

      const newItem: CollectionItem = {
        id: 'item-' + Date.now(),
        url,
        title: aiResult.title,
        summary: aiResult.summary,
        category: aiResult.category,
        tags: aiResult.tags,
        source: aiResult.source,
        thumbnail: '',
        contentType: aiResult.contentType as 'article' | 'video' | 'doc' | 'image',
        createdAt: Date.now(),
        isRead: false,
        isFavorite: false,
      };

      const updated = [newItem, ...items];
      setItems(updated);
      saveItems(updated);
      return newItem;
    } catch (error) {
      console.error('AI processing failed:', error);
      // Fallback: create item with URL as title
      const newItem: CollectionItem = {
        id: 'item-' + Date.now(),
        url,
        title: url.split('/').pop() || '未命名收藏',
        summary: 'AI 摘要生成失败，请检查 DeepSeek API Key 是否正确配置。',
        category: 'article',
        tags: ['未分类'],
        source: '网页',
        thumbnail: '',
        contentType: 'article',
        createdAt: Date.now(),
        isRead: false,
        isFavorite: false,
      };
      const updated = [newItem, ...items];
      setItems(updated);
      saveItems(updated);
      return newItem;
    } finally {
      setIsProcessing(false);
    }
  }, [items, processUrlMutation]);

  const handleToggleRead = useCallback((id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      const updated = updateItem(id, { isRead: !item.isRead });
      setItems(updated);
    }
  }, [items]);

  const handleToggleFavorite = useCallback((id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      const updated = updateItem(id, { isFavorite: !item.isFavorite });
      setItems(updated);
    }
  }, [items]);

  const handleDelete = useCallback((id: string) => {
    const updated = deleteItem(id);
    setItems(updated);
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const handleAiSearch = useCallback(async (query: string) => {
    setIsProcessing(true);
    setAiResults(null);
    try {
      const results = await searchMutation.mutateAsync({
        query,
        items: items.map((i) => ({ id: i.id, title: i.title, summary: i.summary, tags: i.tags })),
      });
      setAiResults(results);
    } catch {
      // Fallback to client-side keyword search
      const q = query.toLowerCase();
      const scored = items
        .map((item) => {
          let score = 0;
          const text = (item.title + ' ' + item.summary + ' ' + item.tags.join(' ')).toLowerCase();
          if (item.title.toLowerCase().includes(q)) score += 5;
          if (item.tags.some((t) => t.toLowerCase().includes(q))) score += 3;
          if (item.summary.toLowerCase().includes(q)) score += 2;
          if (text.includes(q)) score += 1;
          return { item, score };
        })
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((s, i) => ({
          id: s.item.id,
          relevance: Math.round(95 - i * 8),
          reason: `关键词 "${query}" 与内容匹配`,
        }));
      setAiResults(scored);
    } finally {
      setIsProcessing(false);
    }
  }, [items, searchMutation]);

  return {
    items,
    filteredItems,
    categories,
    allTags,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    sortMode,
    setSortMode,
    selectedId,
    setSelectedId,
    selectedItem,
    aiSearchOpen,
    setAiSearchOpen,
    isProcessing,
    aiResults,
    handleAddUrl,
    handleToggleRead,
    handleToggleFavorite,
    handleDelete,
    handleAiSearch,
  };
}
