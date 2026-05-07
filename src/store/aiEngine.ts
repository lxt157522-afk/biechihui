// Simulated AI Engine - mimics real LLM behavior for demo

const CATEGORY_RULES: Record<string, string[]> = {
  tech: ['代码', '编程', '前端', '后端', 'AI', '算法', 'React', 'Vue', 'Python', 'JavaScript', '开发', '工程师', 'API', '数据库', '云', '服务器', '技术'],
  design: ['设计', 'UI', 'UX', 'Figma', 'Sketch', '配色', '排版', '视觉', '界面', '交互', '品牌', '插画', '字体'],
  productivity: ['效率', '时间管理', '笔记', '待办', '工具', '自动化', 'Workflow', 'Notion', '番茄钟', 'GTD', '习惯', '自律'],
  business: ['商业', '创业', '产品', '运营', '增长', '营销', 'SaaS', '定价', '战略', '市场', '用户', '变现', '收入', '商业模式'],
  life: ['生活', '健康', '美食', '旅行', '摄影', '健身', '心理', '读书', '电影', '音乐', '家居', '穿搭'],
};

const SOURCE_MAP: Record<string, string> = {
  'mp.weixin.qq.com': '微信公众号',
  'bilibili.com': 'B站',
  'xiaohongshu.com': '小红书',
  'zhihu.com': '知乎',
  'youtube.com': 'YouTube',
  'weibo.com': '微博',
  'twitter.com': 'Twitter/X',
  'x.com': 'Twitter/X',
  'notion.so': 'Notion',
};

function detectSource(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    for (const [domain, name] of Object.entries(SOURCE_MAP)) {
      if (hostname.includes(domain)) return name;
    }
    return hostname.replace('www.', '');
  } catch {
    return '网页';
  }
}

function detectCategory(text: string): string {
  const lower = text.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_RULES)) {
    if (keywords.some((k) => lower.includes(k.toLowerCase()))) return cat;
  }
  return 'life';
}

function generateTags(title: string, category: string): string[] {
  const allKeywords = Object.values(CATEGORY_RULES).flat();
  const matched = allKeywords.filter((k) =>
    title.toLowerCase().includes(k.toLowerCase())
  );
  const baseTags = matched.slice(0, 3);
  if (baseTags.length < 3) {
    const fallback: Record<string, string[]> = {
      tech: ['技术', '开发'],
      design: ['设计', '创意'],
      productivity: ['效率', '工具'],
      business: ['商业', '分析'],
      life: ['生活', '日常'],
    };
    const fb = fallback[category] || ['收藏'];
    baseTags.push(...fb.slice(0, 3 - baseTags.length));
  }
  return [...new Set(baseTags)].slice(0, 4);
}

function detectContentType(url: string, _title: string): 'article' | 'video' | 'image' | 'doc' {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('bilibili') || lowerUrl.includes('youtube') || lowerUrl.includes('video')) return 'video';
  if (lowerUrl.includes('notion')) return 'doc';
  return 'article';
}

// Simulated title and summary generation based on URL patterns
const TITLE_TEMPLATES: Record<string, string[]> = {
  tech: [
    '深入理解 {topic}：从入门到实战',
    '{topic} 最佳实践指南（2025版）',
    '用 {topic} 重构你的工作流',
    '大厂工程师都在用的 {topic} 技巧',
  ],
  design: [
    '{topic} 设计系统搭建全指南',
    '从0到1：{topic} 实战案例解析',
    '{topic} 趋势报告与灵感合集',
    '设计师必看的 {topic} 方法论',
  ],
  productivity: [
    '{topic}：让效率翻倍的秘密武器',
    '我的 {topic} 工作流大公开',
    '用 {topic} 打造第二大脑',
    '{topic} 终极指南，告别拖延',
  ],
  business: [
    '{topic} 商业模式深度拆解',
    '从 {topic} 看产品增长逻辑',
    '{topic} 实战：从0到10万用户',
    '创业者必读的 {topic} 分析',
  ],
  life: [
    '{topic} 生活指南：少即是多',
    '我的 {topic} 心得与推荐',
    '用 {topic} 提升生活幸福感',
    '{topic} 入门：从零开始',
  ],
};

const SUMMARY_TEMPLATES: Record<string, string[]> = {
  tech: [
    '文章系统讲解了 {topic} 的核心概念和进阶用法，包含多个可运行的代码示例和最佳实践建议。适合有一定基础的开发者阅读。',
    '从底层原理到上层应用，全面剖析 {topic} 的技术细节。文中附有性能对比数据和实际项目经验总结。',
  ],
  design: [
    '详细介绍了 {topic} 的设计方法论，包含多个真实案例拆解和可复用的设计模板。适合设计师和产品经理参考。',
    '汇集了 {topic} 领域的最新趋势和实用技巧，配合大量视觉案例说明，帮助快速建立设计思维。',
  ],
  productivity: [
    '分享了作者使用 {topic} 工具三年来的实战经验，包含完整的设置教程和工作流模板，可直接套用。',
    '从理论到实践，手把手教你用 {topic} 建立个人知识管理系统，附带周回顾和月度复盘模板。',
  ],
  business: [
    '通过真实数据和案例分析，深入解读 {topic} 领域的商业逻辑。包含可落地的策略建议和避坑指南。',
    '采访了多位 {topic} 领域的从业者，整理了他们的成功经验和失败教训，提炼出可复制的增长模型。',
  ],
  life: [
    '分享了关于 {topic} 的实用经验和心得体会，内容轻松有趣，适合在碎片时间阅读。',
    '整理了 {topic} 领域的精选资源和推荐清单，帮助快速入门并找到最适合自己的方式。',
  ],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function extractTopic(url: string): string {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    // Try to extract meaningful topic from URL path
    const segments = path.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1] || '';
    // Clean up the segment
    const clean = lastSegment
      .replace(/\.html?$/, '')
      .replace(/[-_]/g, ' ')
      .replace(/\d+/g, '')
      .trim();
    if (clean.length > 2 && clean.length < 20) return clean;
  } catch {
    // ignore
  }
  // Fallback topics
  const topics = ['AI工具', '效率方法', '产品设计', '编程技巧', '生活美学', '数据分析', '读书笔记'];
  return pickRandom(topics);
}

export interface AIProcessResult {
  title: string;
  summary: string;
  category: string;
  tags: string[];
  source: string;
  contentType: 'article' | 'video' | 'image' | 'doc';
}

export async function processUrl(url: string): Promise<AIProcessResult> {
  // Simulate network delay for AI processing
  await delay(1200 + Math.random() * 800);

  const source = detectSource(url);
  const topic = extractTopic(url);
  const category = detectCategory(topic + ' ' + url);
  const contentType = detectContentType(url, topic);
  const tags = generateTags(topic, category);

  const titles = TITLE_TEMPLATES[category] || TITLE_TEMPLATES.life;
  const summaries = SUMMARY_TEMPLATES[category] || SUMMARY_TEMPLATES.life;

  const title = pickRandom(titles).replace('{topic}', topic);
  const summary = pickRandom(summaries).replace('{topic}', topic);

  return { title, summary, category, tags, source, contentType };
}

// Simulated semantic search
export async function semanticSearch(
  query: string,
  allItems: { id: string; title: string; summary: string; tags: string[] }[]
): Promise<{ id: string; relevance: number; reason: string }[]> {
  await delay(600 + Math.random() * 400);

  const lowerQuery = query.toLowerCase();
  const queryTerms = lowerQuery.split(/\s+/).filter((t) => t.length > 1);

  const results = allItems
    .map((item) => {
      let score = 0;
      const itemText = (item.title + ' ' + item.summary + ' ' + item.tags.join(' ')).toLowerCase();

      // Direct match scoring
      for (const term of queryTerms) {
        if (item.title.toLowerCase().includes(term)) score += 3;
        if (item.summary.toLowerCase().includes(term)) score += 2;
        if (item.tags.some((t) => t.toLowerCase().includes(term))) score += 2.5;
        if (itemText.includes(term)) score += 1;
      }

      // Semantic similarity (simplified keyword matching)
      const semanticMap: Record<string, string[]> = {
        '编程': ['代码', '开发', '技术', '前端', 'React', 'Python'],
        '效率': ['时间管理', '工具', '自动化', 'Notion', 'Workflow'],
        '设计': ['UI', 'UX', 'Figma', '视觉', '创意'],
        '学习': ['教程', '指南', '入门', '课程', '读书'],
        '赚钱': ['商业', '创业', '变现', '收入', 'SaaS'],
        '视频': ['B站', 'YouTube', '教程'],
        '文章': ['公众号', '知乎', '博客'],
      };

      for (const [key, related] of Object.entries(semanticMap)) {
        if (lowerQuery.includes(key)) {
          for (const rel of related) {
            if (itemText.includes(rel.toLowerCase())) score += 1.5;
          }
        }
      }

      return { id: item.id, score, itemText, title: item.title };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((r) => ({
      id: r.id,
      relevance: Math.min(100, Math.round((r.score / 8) * 100)),
      reason: generateReason(lowerQuery, r.title),
    }));

  return results;
}

function generateReason(query: string, _title: string): string {
  const reasons = [
    `标题和摘要中提到了"${query}"相关内容`,
    `内容与"${query}"高度相关`,
    `标签和主题匹配"${query}"`,
    `文章中讨论了"${query}"的核心概念`,
    `推荐查看，涉及"${query}"相关内容`,
  ];
  return pickRandom(reasons);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
