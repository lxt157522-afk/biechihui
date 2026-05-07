import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { env } from "./lib/env";

/**
 * Fetch and extract text content from a URL
 */
async function fetchUrlContent(url: string): Promise<{ title: string; text: string }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();

    // Extract title
    let title = "";
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    if (titleMatch) {
      title = titleMatch[1].trim();
    }
    // Try og:title
    if (!title) {
      const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i);
      if (ogTitleMatch) title = ogTitleMatch[1].trim();
    }

    // Extract body text - remove script, style, nav, footer, etc.
    let text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
      .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim();

    // Limit content length
    text = text.slice(0, 8000);

    return { title, text };
  } catch (error) {
    console.error("Failed to fetch URL:", error);
    return { title: "", text: "" };
  }
}

/**
 * Call DeepSeek API to analyze content
 */
async function deepseekAnalyze(title: string, content: string, url: string): Promise<{
  title: string;
  summary: string;
  category: string;
  tags: string[];
  source: string;
  contentType: string;
}> {
  const apiKey = env.deepseekApiKey;
  if (!apiKey || apiKey === "sk-placeholder-replace-with-your-key") {
    throw new Error("DeepSeek API Key not configured. Please set DEEPSEEK_API_KEY in .env file.");
  }

  const prompt = `你是一位专业的信息整理助手。请分析以下网页内容，并输出结构化的 JSON 结果。

要求：
1. title: 给内容起一个简洁有吸引力的中文标题（不超过30字）
2. summary: 用2-3句话概括核心内容（中文，不超过150字）
3. category: 从以下分类中选择一个最匹配的：[tech(技术), design(设计), productivity(效率), business(商业), life(生活), article(文章), video(视频)]
4. tags: 生成3-5个关键词标签（中文，每个不超过6字）
5. source: 判断内容来源平台（如：微信公众号、B站、知乎、YouTube、微博、Twitter/X、小红书、Notion、网页等）
6. contentType: 判断内容类型 [article(文章), video(视频), doc(文档)]

原始标题：${title || "无"}
URL：${url}

内容：
${content.slice(0, 6000)}

请只输出 JSON，不要其他文字：
{
  "title": "...",
  "summary": "...",
  "category": "...",
  "tags": ["...", "..."],
  "source": "...",
  "contentType": "..."
}`;

  const response = await fetch(`${env.deepseekApiUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "你是一个专业的信息整理和分类助手，擅长从网页内容中提取关键信息并进行结构化整理。" },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json() as {
    choices: [{ message: { content: string } }];
  };

  const rawContent = data.choices[0].message.content;

  // Extract JSON from response (handle markdown code blocks)
  const jsonMatch = rawContent.match(/```json\n?([\s\S]*?)\n?```/) ||
    rawContent.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("Failed to parse DeepSeek response");
  }

  const jsonStr = jsonMatch[1] || jsonMatch[0];
  const result = JSON.parse(jsonStr);

  // Validate and normalize
  return {
    title: result.title || title || "未命名收藏",
    summary: result.summary || "暂无摘要",
    category: ["tech", "design", "productivity", "business", "life", "article", "video"].includes(result.category)
      ? result.category
      : "article",
    tags: Array.isArray(result.tags) ? result.tags.slice(0, 5) : [],
    source: result.source || detectSource(url),
    contentType: ["article", "video", "doc"].includes(result.contentType)
      ? result.contentType
      : "article",
  };
}

function detectSource(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    const map: Record<string, string> = {
      "mp.weixin.qq.com": "微信公众号",
      "bilibili.com": "B站",
      "xiaohongshu.com": "小红书",
      "zhihu.com": "知乎",
      "youtube.com": "YouTube",
      "youtu.be": "YouTube",
      "weibo.com": "微博",
      "twitter.com": "Twitter/X",
      "x.com": "Twitter/X",
      "notion.so": "Notion",
    };
    for (const [domain, name] of Object.entries(map)) {
      if (hostname.includes(domain)) return name;
    }
    return hostname.replace(/^www\./, "");
  } catch {
    return "网页";
  }
}

/**
 * Semantic search using DeepSeek
 */
async function deepseekSearch(query: string, items: { id: string; title: string; summary: string; tags: string[] }[]): Promise<{
  id: string;
  relevance: number;
  reason: string;
}[]> {
  const apiKey = env.deepseekApiKey;
  if (!apiKey || apiKey === "sk-placeholder-replace-with-your-key") {
    // Fallback to keyword search
    return keywordSearch(query, items);
  }

  const itemsText = items.map((item, i) =>
    `[${i}] ${item.title} | 标签: ${item.tags.join(",")} | 摘要: ${item.summary.slice(0, 100)}`
  ).join("\n");

  const prompt = `你是一个语义搜索引擎。用户用自然语言查询，你需要从以下收藏中找到最相关的条目。

用户查询："${query}"

可用收藏：
${itemsText}

请返回最相关的5个条目的索引编号（从0开始），以及匹配原因。只输出 JSON：
{
  "results": [
    { "index": 0, "reason": "匹配原因" },
    ...
  ]
}`;

  const response = await fetch(`${env.deepseekApiUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "你是一个语义搜索助手，擅长理解用户意图并匹配相关内容。" },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    return keywordSearch(query, items);
  }

  const data = await response.json() as {
    choices: [{ message: { content: string } }];
  };

  try {
    const rawContent = data.choices[0].message.content;
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return keywordSearch(query, items);

    const result = JSON.parse(jsonMatch[0]);
    const results: { id: string; relevance: number; reason: string }[] = [];

    for (const r of result.results || []) {
      const idx = r.index;
      if (items[idx]) {
        results.push({
          id: items[idx].id,
          relevance: Math.round(90 - results.length * 5),
          reason: r.reason || "语义匹配",
        });
      }
    }

    return results.length > 0 ? results : keywordSearch(query, items);
  } catch {
    return keywordSearch(query, items);
  }
}

function keywordSearch(
  query: string,
  items: { id: string; title: string; summary: string; tags: string[] }[]
): { id: string; relevance: number; reason: string }[] {
  const q = query.toLowerCase();
  const scored = items.map((item) => {
    let score = 0;
    const text = (item.title + " " + item.summary + " " + item.tags.join(" ")).toLowerCase();

    // Direct keyword matching
    if (item.title.toLowerCase().includes(q)) score += 5;
    if (item.tags.some((t) => t.toLowerCase().includes(q))) score += 3;
    if (item.summary.toLowerCase().includes(q)) score += 2;
    if (text.includes(q)) score += 1;

    return { item, score };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored
    .filter((s) => s.score > 0)
    .slice(0, 5)
    .map((s, i) => ({
      id: s.item.id,
      relevance: Math.round(95 - i * 8),
      reason: `关键词 "${query}" 与标题或内容匹配`,
    }));
}

// tRPC router
export const aiRouter = createRouter({
  processUrl: publicQuery
    .input(z.object({ url: z.string().url() }))
    .mutation(async ({ input }) => {
      const { title, text } = await fetchUrlContent(input.url);

      if (!text && !title) {
        throw new Error("无法获取该链接的内容，请检查链接是否有效。");
      }

      const result = await deepseekAnalyze(title, text, input.url);
      return result;
    }),

  search: publicQuery
    .input(z.object({
      query: z.string().min(1),
      items: z.array(z.object({
        id: z.string(),
        title: z.string(),
        summary: z.string(),
        tags: z.array(z.string()),
      })),
    }))
    .mutation(async ({ input }) => {
      const results = await deepseekSearch(input.query, input.items);
      return results;
    }),
});
