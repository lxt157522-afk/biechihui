import { useState, useCallback, useMemo } from 'react';
import type { CollectionItem, ViewMode, SortMode } from '@/types';
import { loadItems, saveItems, updateItem, deleteItem, getCategories, getAllTags } from '@/store/data';
import { processUrl, semanticSearch } from '@/store/aiEngine';
import { useRef } from 'react';

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
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const categories = useMemo(() => getCategories(items), [items]);
  const allTags = useMemo(() => getAllTags(items), [items]);

  const filteredItems = useMemo(() => {
    let result = [...items];

    // Category filter
    if (activeCategory !== 'all') {
      switch (activeCategory) {
        case 'unread':
          result = result.filter((i) => !i.isRead);
          break;
        case 'favorite':
          result = result.filter((i) => i.isFavorite);
          break;
        case 'article':
          result = result.filter((i) => i.contentType === 'article');
          break;
        case 'video':
          result = result.filter((i) => i.contentType === 'video');
          break;
        default:
          result = result.filter((i) => i.category === activeCategory);
      }
    }

    // Text search filter
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

    // Sort
    switch (sortMode) {
      case 'newest':
        result.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'oldest':
        result.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case 'unread':
        result.sort((a, b) => (a.isRead === b.isRead ? 0 : a.isRead ? 1 : -1));
        break;
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
      const aiResult = await processUrl(url);
      const newItem: CollectionItem = {
        id: 'item-' + Date.now(),
        url,
        title: aiResult.title,
        summary: aiResult.summary,
        category: aiResult.category,
        tags: aiResult.tags,
        source: aiResult.source,
        thumbnail: '',
        contentType: aiResult.contentType,
        createdAt: Date.now(),
        isRead: false,
        isFavorite: false,
      };
      const updated = [newItem, ...itemsRef.current];
      setItems(updated);
      saveItems(updated);
      return newItem;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleToggleRead = useCallback((id: string) => {
    const item = itemsRef.current.find((i) => i.id === id);
    if (item) {
      const updated = updateItem(id, { isRead: !item.isRead });
      setItems(updated);
    }
  }, []);

  const handleToggleFavorite = useCallback((id: string) => {
    const item = itemsRef.current.find((i) => i.id === id);
    if (item) {
      const updated = updateItem(id, { isFavorite: !item.isFavorite });
      setItems(updated);
    }
  }, []);

  const handleDelete = useCallback((id: string) => {
    const updated = deleteItem(id);
    setItems(updated);
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const handleAiSearch = useCallback(async (query: string) => {
    setIsProcessing(true);
    setAiResults(null);
    try {
      const results = await semanticSearch(
        query,
        itemsRef.current.map((i) => ({
          id: i.id,
          title: i.title,
          summary: i.summary,
          tags: i.tags,
        }))
      );
      setAiResults(results);
    } finally {
      setIsProcessing(false);
    }
  }, []);

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
