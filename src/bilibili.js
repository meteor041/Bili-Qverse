import { CONFIG } from './config.js';

const HEADERS = {
  'User-Agent': process.env.BILIBILI_USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Referer: 'https://www.bilibili.com/',
  Origin: 'https://www.bilibili.com',
  Accept: 'application/json, text/plain, */*',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
};

if (process.env.BILIBILI_COOKIE) HEADERS.Cookie = process.env.BILIBILI_COOKIE;

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function request(url) {
  let lastError;

  for (let attempt = 0; attempt <= CONFIG.fetchRetries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), CONFIG.fetchTimeoutMs);

    try {
      const response = await fetch(url, { headers: HEADERS, signal: controller.signal });
      clearTimeout(timeout);
      return response;
    } catch (error) {
      clearTimeout(timeout);
      lastError = error;
      if (attempt < CONFIG.fetchRetries) await sleep(CONFIG.requestDelayMs * (attempt + 1));
    }
  }

  throw lastError;
}

function shouldRetryStatus(status) {
  return status === 412 || status === 429 || status >= 500;
}

async function waitBeforeRetry(attempt) {
  const jitter = Math.floor(Math.random() * CONFIG.requestDelayMs);
  await sleep(CONFIG.requestDelayMs * (attempt + 2) + jitter);
}

export async function fetchJson(url) {
  let lastError;

  for (let attempt = 0; attempt <= CONFIG.fetchRetries; attempt += 1) {
    const response = await request(url);
    if (response.ok) {
      const json = await response.json();
      if (json.code === 0) return json;
      lastError = new Error(`Bilibili API ${json.code}: ${json.message || url}`);
    } else {
      lastError = new Error(`HTTP ${response.status}: ${url}`);
      if (!shouldRetryStatus(response.status)) throw lastError;
    }

    if (attempt < CONFIG.fetchRetries) await waitBeforeRetry(attempt);
  }

  throw lastError;
}

export async function fetchText(url) {
  let lastError;

  for (let attempt = 0; attempt <= CONFIG.fetchRetries; attempt += 1) {
    const response = await request(url);
    if (response.ok) return response.text();

    lastError = new Error(`HTTP ${response.status}: ${url}`);
    if (!shouldRetryStatus(response.status)) throw lastError;
    if (attempt < CONFIG.fetchRetries) await waitBeforeRetry(attempt);
  }

  throw lastError;
}

export async function fetchNewlist(rid, pn, ps) {
  const url = new URL('https://api.bilibili.com/x/web-interface/newlist');
  url.searchParams.set('rid', String(rid));
  url.searchParams.set('pn', String(pn));
  url.searchParams.set('ps', String(ps));
  return fetchJson(url);
}

export async function fetchVideoView(bvid) {
  const url = new URL('https://api.bilibili.com/x/web-interface/view');
  url.searchParams.set('bvid', bvid);
  return fetchJson(url);
}

export async function fetchVideoTags(bvid) {
  const url = new URL('https://api.bilibili.com/x/tag/archive/tags');
  url.searchParams.set('bvid', bvid);
  return fetchJson(url);
}

export async function fetchVideoReplies(aid, pn, ps) {
  const url = new URL('https://api.bilibili.com/x/v2/reply');
  url.searchParams.set('type', '1');
  url.searchParams.set('oid', String(aid));
  url.searchParams.set('pn', String(pn));
  url.searchParams.set('ps', String(ps));
  url.searchParams.set('sort', '2');
  return fetchJson(url);
}

export async function fetchDanmakuXml(cid) {
  return fetchText(`https://comment.bilibili.com/${cid}.xml`);
}

function decodeXmlText(value) {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

export function hasQuestion(value) {
  return value.includes('?') || value.includes('？');
}

export function parseDanmakuXml(xml) {
  const matches = xml.matchAll(/<d\b[^>]*p="([^"]*)"[^>]*>([\s\S]*?)<\/d>/g);
  const items = [];

  for (const match of matches) {
    const parts = match[1].split(',');
    const time = Number(parts[0] || 0);
    const sendTime = Number(parts[4] || 0);
    const content = decodeXmlText(match[2] || '');
    items.push({
      time: Number.isFinite(time) ? time : 0,
      sendTime: Number.isFinite(sendTime) ? sendTime : 0,
      content,
      isQuestion: hasQuestion(content)
    });
  }

  return items;
}

export function countQuestionDanmaku(xml) {
  const items = parseDanmakuXml(xml);
  const daily = new Map();

  for (const item of items) {
    if (!item.sendTime) continue;
    const statDate = new Date(item.sendTime * 1000).toISOString().slice(0, 10);
    const stat = daily.get(statDate) || { statDate, questionCount: 0, danmakuCount: 0 };
    stat.danmakuCount += 1;
    if (item.isQuestion) stat.questionCount += 1;
    daily.set(statDate, stat);
  }

  return {
    questionCount: items.filter(item => item.isQuestion).length,
    danmakuCount: items.length,
    dailyStats: [...daily.values()]
  };
}
