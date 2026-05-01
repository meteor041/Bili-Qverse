import { createReadStream, existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { CONFIG, getCutoff } from './config.js';
import { analyzeVideo } from './analysis.js';
import { crawl } from './crawler.js';
import { estimateQuestionScore, getHotTags, getRankingPayload, getRealtimeStats, getStatsSummary } from './db.js';

const PUBLIC_DIR = process.env.PUBLIC_DIR || (existsSync('dist') ? 'dist' : 'public');
const PUBLIC_ROOT = resolve(PUBLIC_DIR);
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jsx': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml'
};

let crawlPromise = null;

function sendJson(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(body));
}

function sendError(response, status, message) {
  sendJson(response, status, { error: message });
}

function normalizeBilibiliImageUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return null;
  const normalized = raw.startsWith('//') ? `https:${raw}` : raw.replace(/^http:\/\//i, 'https://');
  let parsed;
  try {
    parsed = new URL(normalized);
  } catch {
    return null;
  }
  if (!/^i[0-9]\.hdslb\.com$/i.test(parsed.hostname)) return null;
  if (!parsed.pathname.startsWith('/bfs/')) return null;
  return parsed;
}

async function proxyImage(request, response) {
  const requestUrl = new URL(request.url, 'http://localhost');
  const imageUrl = normalizeBilibiliImageUrl(requestUrl.searchParams.get('url'));
  if (!imageUrl) {
    sendError(response, 400, 'Invalid image url');
    return;
  }

  const upstream = await fetch(imageUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      Referer: 'https://www.bilibili.com/'
    }
  });
  if (!upstream.ok) {
    sendError(response, upstream.status, `Image HTTP ${upstream.status}`);
    return;
  }

  const contentType = upstream.headers.get('content-type') || 'image/jpeg';
  const buffer = Buffer.from(await upstream.arrayBuffer());
  response.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    'Access-Control-Allow-Origin': '*'
  });
  response.end(buffer);
}

async function serveStatic(request, response) {
  const url = new URL(request.url, 'http://localhost');
  const pathname = url.pathname === '/' ? '/index.html' : url.pathname;
  const safePath = normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  const filePath = resolve(join(PUBLIC_DIR, safePath));

  if (!filePath.startsWith(`${PUBLIC_ROOT}/`) && filePath !== PUBLIC_ROOT) {
    sendError(response, 403, 'Forbidden');
    return;
  }

  try {
    await readFile(filePath);
    response.writeHead(200, { 'Content-Type': MIME_TYPES[extname(filePath)] || 'application/octet-stream' });
    createReadStream(filePath).pipe(response);
  } catch (error) {
    if (error.code === 'ENOENT') sendError(response, 404, 'Not found');
    else sendError(response, 500, error.message);
  }
}

async function handleApi(request, response) {
  const url = new URL(request.url, 'http://localhost');

  if (url.pathname === '/api/image' && request.method === 'GET') {
    await proxyImage(request, response);
    return;
  }

  const analysisMatch = url.pathname.match(/^\/api\/video\/(BV[0-9A-Za-z]+)\/analysis$/);
  if (analysisMatch && request.method === 'GET') {
    const force = url.searchParams.get('force') === '1';
    sendJson(response, 200, await analyzeVideo(analysisMatch[1], { force }));
    return;
  }

  if (url.pathname === '/api/ranking' && request.method === 'GET') {
    const limit = Number(url.searchParams.get('limit') || CONFIG.rankingLimit);
    const sort = url.searchParams.get('sort') || 'score';
    const range = url.searchParams.get('range') || 'week';
    sendJson(response, 200, await getRankingPayload({ limit, sort, range }));
    return;
  }

  if (url.pathname === '/api/stats/realtime' && request.method === 'GET') {
    sendJson(response, 200, await getRealtimeStats());
    return;
  }

  if (url.pathname === '/api/stats/summary' && request.method === 'GET') {
    const range = url.searchParams.get('range') || 'day';
    sendJson(response, 200, await getStatsSummary({ range }));
    return;
  }

  if (url.pathname === '/api/tags/hot' && request.method === 'GET') {
    const range = url.searchParams.get('range') || 'week';
    const limit = Number(url.searchParams.get('limit') || 16);
    sendJson(response, 200, await getHotTags({ range, limit }));
    return;
  }

  if (url.pathname === '/api/tools/estimate' && request.method === 'GET') {
    sendJson(response, 200, await estimateQuestionScore(url.searchParams.get('text') || ''));
    return;
  }

  if (url.pathname === '/api/crawl' && request.method === 'POST') {
    if (!crawlPromise) {
      crawlPromise = crawl().finally(() => {
        crawlPromise = null;
      });
    }
    const payload = await crawlPromise;
    sendJson(response, 200, payload);
    return;
  }

  if (url.pathname === '/api/status' && request.method === 'GET') {
    sendJson(response, 200, { crawling: Boolean(crawlPromise) });
    return;
  }

  sendError(response, 404, 'Not found');
}

const server = createServer(async (request, response) => {
  try {
    if (request.url.startsWith('/api/')) await handleApi(request, response);
    else await serveStatic(request, response);
  } catch (error) {
    sendError(response, 500, error.message);
  }
});

server.listen(CONFIG.serverPort, () => {
  console.log(`qlist listening on http://localhost:${CONFIG.serverPort}`);
});
