import { useState, useCallback } from 'react';
import { useStore } from '@/hooks/useStore';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import CardGrid from '@/components/cards/CardGrid';
import DetailPanel from '@/components/cards/DetailPanel';
import AISearchModal from '@/components/modals/AISearchModal';
import AddUrlModal from '@/components/modals/AddUrlModal';

export default function App() {
  const store = useStore();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<typeof store.filteredItems[0] | null>(null);

  // Handle adding URL - show modal then process
  const handleAddUrl = useCallback(async (url: string) => {
    setAddModalOpen(true);
    const item = await store.handleAddUrl(url);
    setLastAddedItem(item);
  }, [store]);

  // Handle tag click in sidebar
  const handleTagClick = useCallback((tag: string) => {
    store.setSearchQuery(tag);
    store.setActiveCategory('all');
  }, [store]);

  // Keyboard shortcut for AI search
  useState(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        store.setAiSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: '#fff' }}>
      {/* Left Sidebar */}
      <Sidebar
        categories={store.categories}
        activeCategory={store.activeCategory}
        onCategoryChange={store.setActiveCategory}
        allTags={store.allTags}
        onTagClick={handleTagClick}
        onSearchOpen={() => store.setAiSearchOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top Bar */}
        <TopBar
          itemCount={store.filteredItems.length}
          viewMode={store.viewMode}
          sortMode={store.sortMode}
          onViewModeChange={store.setViewMode}
          onSortModeChange={store.setSortMode}
          onAddUrl={handleAddUrl}
          onAiSearchOpen={() => store.setAiSearchOpen(true)}
          isProcessing={store.isProcessing}
        />

        {/* Search filter bar */}
        {store.searchQuery && (
          <div
            className="flex items-center gap-2 px-5 py-2 border-b"
            style={{ borderColor: '#f0f0f0', background: '#fafafa' }}
          >
            <span className="text-[12px]" style={{ color: '#999' }}>
              搜索：<strong style={{ color: '#111' }}>{store.searchQuery}</strong>
            </span>
            <span className="text-[12px]" style={{ color: '#c7c7cc' }}>
              ({store.filteredItems.length} 条结果)
            </span>
            <button
              onClick={() => store.setSearchQuery('')}
              className="ml-2 text-[11px] px-2 py-0.5 rounded hover:bg-[#eaeaea] transition-colors"
              style={{ color: '#999' }}
            >
              清除
            </button>
          </div>
        )}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <CardGrid
            items={store.filteredItems}
            viewMode={store.viewMode}
            selectedId={store.selectedId}
            onSelect={store.setSelectedId}
            onToggleFavorite={store.handleToggleFavorite}
            onToggleRead={store.handleToggleRead}
            onDelete={store.handleDelete}
          />
        </div>
      </div>

      {/* Right Detail Panel */}
      {store.selectedId && (
        <DetailPanel
          item={store.selectedItem}
          onClose={() => store.setSelectedId(null)}
          onToggleFavorite={store.handleToggleFavorite}
          onToggleRead={store.handleToggleRead}
          onDelete={store.handleDelete}
        />
      )}

      {/* AI Search Modal */}
      <AISearchModal
        open={store.aiSearchOpen}
        onClose={() => { store.setAiSearchOpen(false); }}
        items={store.items}
        results={store.aiResults}
        isProcessing={store.isProcessing}
        onSearch={store.handleAiSearch}
        onSelectItem={(id) => { store.setSelectedId(id); store.setAiSearchOpen(false); }}
      />

      {/* Add URL Modal */}
      <AddUrlModal
        open={addModalOpen}
        onClose={() => { setAddModalOpen(false); setLastAddedItem(null); }}
        isProcessing={store.isProcessing}
        newItem={lastAddedItem}
        onSubmit={handleAddUrl}
      />
    </div>
  );
}
