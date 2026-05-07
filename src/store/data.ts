import type { CollectionItem, Category } from '@/types';

const STORAGE_KEY = 'biechihui_collections';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'all', name: '全部收藏', icon: 'inbox', count: 0 },
  { id: 'unread', name: '未读', icon: 'circle', count: 0 },
  { id: 'favorite', name: '星标', icon: 'star', count: 0 },
  { id: 'article', name: '文章', icon: 'file-text', count: 0 },
  { id: 'video', name: '视频', icon: 'play-circle', count: 0 },
  { id: 'tech', name: '技术', icon: 'code', count: 0 },
  { id: 'design', name: '设计', icon: 'palette', count: 0 },
  { id: 'productivity', name: '效率', icon: 'zap', count: 0 },
  { id: 'business', name: '商业', icon: 'trending-up', count: 0 },
  { id: 'life', name: '生活', icon: 'coffee', count: 0 },
];

export const DEMO_ITEMS: CollectionItem[] = [
  {
    id: 'demo-1',
    url: 'https://mp.weixin.qq.com/s/example1',
    title: '2025年AI编程助手深度横评：Cursor vs Windsurf vs GitHub Copilot',
    summary: '文章详细对比了三大AI编程工具的代码补全准确率、上下文理解能力和实际开发效率。Cursor在复杂重构任务中表现最佳，Copilot适合快速原型开发。',
    category: 'tech',
    tags: ['AI', '编程工具', '效率'],
    source: '微信公众号',
    thumbnail: '',
    contentType: 'article',
    createdAt: Date.now() - 86400000 * 2,
    isRead: false,
    isFavorite: true,
    fullContent: '全文内容...Cursor 的核心优势在于其深度理解代码上下文的能力...',
  },
  {
    id: 'demo-2',
    url: 'https://www.bilibili.com/video/BV1xx411c7mD',
    title: 'Figma 2025新功能全解析：AI设计助手让效率翻倍',
    summary: '视频演示了Figma最新发布的AI功能，包括自动生成设计变体、智能排版建议和一键生成设计规范文档。实测可节省40%的设计时间。',
    category: 'design',
    tags: ['Figma', 'AI设计', 'UI/UX'],
    source: 'B站',
    thumbnail: '',
    contentType: 'video',
    createdAt: Date.now() - 86400000 * 5,
    isRead: true,
    isFavorite: false,
    fullContent: '视频转录文本...',
  },
  {
    id: 'demo-3',
    url: 'https://www.xiaohongshu.com/discovery/item/example',
    title: '10个让打工人效率翻倍的Chrome插件，第7个绝了',
    summary: '整理了10款实用Chrome插件：沉浸式翻译、Tree Style Tab侧边栏标签管理、Raindrop收藏同步、Dark Reader夜间模式等。每款都附带了使用场景和配置技巧。',
    category: 'productivity',
    tags: ['Chrome', '插件', '效率工具'],
    source: '小红书',
    thumbnail: '',
    contentType: 'article',
    createdAt: Date.now() - 86400000 * 7,
    isRead: false,
    isFavorite: true,
  },
  {
    id: 'demo-4',
    url: 'https://www.zhihu.com/question/123456789',
    title: '深度解析：SaaS产品从0到1的定价策略与免费增值模型',
    summary: '从产品定位、用户画像、竞品分析三个维度出发，详细拆解了SaaS产品的定价方法论。包含Freemium、Usage-based、Seat-based三种主流模式的适用场景和转化数据。',
    category: 'business',
    tags: ['SaaS', '产品定价', '商业分析'],
    source: '知乎',
    thumbnail: '',
    contentType: 'article',
    createdAt: Date.now() - 86400000 * 10,
    isRead: true,
    isFavorite: false,
  },
  {
    id: 'demo-5',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'React Server Components 完全指南：从原理到实践',
    summary: '视频从零开始讲解RSC的工作原理，包括服务端渲染流程、流式传输、客户端水合等核心概念。附带三个实战案例：博客系统、电商页面、Dashboard。',
    category: 'tech',
    tags: ['React', '前端', 'RSC'],
    source: 'YouTube',
    thumbnail: '',
    contentType: 'video',
    createdAt: Date.now() - 86400000 * 12,
    isRead: false,
    isFavorite: false,
  },
  {
    id: 'demo-6',
    url: 'https://weibo.com/1234567890/example',
    title: '摄影师的极简生活：如何用iPhone拍出胶片感大片',
    summary: '分享了iPhone原生相机的进阶拍摄技巧，包括曝光锁定、人像模式的光圈调节、Live Photo创意用法，以及VSCO和Lightroom Mobile的调色参数。',
    category: 'life',
    tags: ['摄影', 'iPhone', '生活方式'],
    source: '微博',
    thumbnail: '',
    contentType: 'article',
    createdAt: Date.now() - 86400000 * 15,
    isRead: true,
    isFavorite: true,
  },
  {
    id: 'demo-7',
    url: 'https://www.notion.so/templates/example',
    title: 'Notion Second Brain 第二大脑搭建全攻略',
    summary: '手把手教你用Notion搭建PARA笔记系统，涵盖Project、Area、Resource、Archive四大模块的模板设计和自动化工作流配置。',
    category: 'productivity',
    tags: ['Notion', '知识管理', 'PARA'],
    source: 'Notion',
    thumbnail: '',
    contentType: 'doc',
    createdAt: Date.now() - 86400000 * 18,
    isRead: false,
    isFavorite: false,
  },
  {
    id: 'demo-8',
    url: 'https://twitter.com/example/status/123456',
    title: 'Thread: 独立开发者如何用AI工具月收入过万',
    summary: '分享了独立开发者利用AI Coding助手、AI设计工具和自动化营销工具，在3个月内将 side project 变现的真实路径。包含工具栈、时间分配和避坑指南。',
    category: 'business',
    tags: ['独立开发', 'AI工具', '副业'],
    source: 'Twitter/X',
    thumbnail: '',
    contentType: 'article',
    createdAt: Date.now() - 86400000 * 20,
    isRead: true,
    isFavorite: true,
  },
];

// Store functions
export function loadItems(): CollectionItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  // First load: save demo data
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_ITEMS));
  return DEMO_ITEMS;
}

export function saveItems(items: CollectionItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function addItem(item: CollectionItem) {
  const items = loadItems();
  items.unshift(item);
  saveItems(items);
  return items;
}

export function updateItem(id: string, updates: Partial<CollectionItem>) {
  const items = loadItems();
  const idx = items.findIndex((i) => i.id === id);
  if (idx >= 0) {
    items[idx] = { ...items[idx], ...updates };
    saveItems(items);
  }
  return items;
}

export function deleteItem(id: string) {
  const items = loadItems().filter((i) => i.id !== id);
  saveItems(items);
  return items;
}

export function getCategories(items: CollectionItem[]): Category[] {
  return DEFAULT_CATEGORIES.map((cat) => {
    let count = 0;
    switch (cat.id) {
      case 'all':
        count = items.length;
        break;
      case 'unread':
        count = items.filter((i) => !i.isRead).length;
        break;
      case 'favorite':
        count = items.filter((i) => i.isFavorite).length;
        break;
      case 'article':
        count = items.filter((i) => i.contentType === 'article').length;
        break;
      case 'video':
        count = items.filter((i) => i.contentType === 'video').length;
        break;
      default:
        count = items.filter((i) => i.category === cat.id).length;
    }
    return { ...cat, count };
  });
}

export function getAllTags(items: CollectionItem[]): string[] {
  const tagSet = new Set<string>();
  items.forEach((item) => item.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet);
}
