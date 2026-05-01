import { existsSync, readFileSync } from 'node:fs';

function loadDotEnv(file = '.env') {
  if (!existsSync(file)) return;
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const index = trimmed.indexOf('=');
    if (index <= 0) continue;
    const key = trimmed.slice(0, index).trim();
    const rawValue = trimmed.slice(index + 1).trim();
    if (process.env[key] !== undefined) continue;
    process.env[key] = rawValue.replace(/^['"]|['"]$/g, '');
  }
}

loadDotEnv();

export const CONFIG = {
  crawlStartDate: process.env.CRAWL_START_DATE || '',
  recentDays: Number(process.env.RECENT_DAYS || 7),
  viewThreshold: Number(process.env.VIEW_THRESHOLD || 100000),
  earlyWindowHours: Number(process.env.EARLY_WINDOW_HOURS || 0),
  earlyViewThreshold: Number(process.env.EARLY_VIEW_THRESHOLD || 0),
  maxPagesPerRid: Number(process.env.MAX_PAGES_PER_RID || 200),
  pageSize: Number(process.env.PAGE_SIZE || 50),
  requestDelayMs: Number(process.env.REQUEST_DELAY_MS || 700),
  fetchTimeoutMs: Number(process.env.FETCH_TIMEOUT_MS || 15000),
  fetchRetries: Number(process.env.FETCH_RETRIES || 2),
  danmakuCacheTtlHours: Number(process.env.DANMAKU_CACHE_TTL_HOURS || 6),
  forceRescan: process.env.FORCE_RESCAN === '1',
  analysisCacheTtlHours: Number(process.env.ANALYSIS_CACHE_TTL_HOURS || 6),
  commentPages: Number(process.env.COMMENT_PAGES || 5),
  commentPageSize: Number(process.env.COMMENT_PAGE_SIZE || 20),
  timelineBucketSeconds: Number(process.env.TIMELINE_BUCKET_SECONDS || 30),
  ridConcurrency: Number(process.env.RID_CONCURRENCY || 4),
  videoConcurrency: Number(process.env.VIDEO_CONCURRENCY || 8),
  pageConcurrency: Number(process.env.PAGE_CONCURRENCY || 3),
  rankingLimit: Number(process.env.RANKING_LIMIT || 100),
  serverPort: Number(process.env.PORT || 3000),
  postgresUrl: process.env.POSTGRES_URL || process.env.DATABASE_URL || 'postgres://qlist:qlist@127.0.0.1:5432/qlist',
  postgresSslRejectUnauthorized: process.env.POSTGRES_SSL_REJECT_UNAUTHORIZED !== '0',
  redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  rankingCacheSeconds: Number(process.env.RANKING_CACHE_SECONDS || 60),
  statsCacheSeconds: Number(process.env.STATS_CACHE_SECONDS || 15),
  rids: (process.env.RIDS || [
    24, 25, 47, 257, 210, 86, 253, 27,
    51, 152, 32, 33,
    153, 168, 169, 170, 195,
    28, 29, 31, 59, 243, 30, 193, 266, 265, 267, 244, 130,
    20, 198, 199, 200, 255, 154, 156,
    17, 171, 172, 65, 173, 121, 136, 19,
    201, 124, 228, 207, 208, 209, 229, 122,
    95, 230, 231, 232, 233,
    235, 249, 164, 236, 237, 238,
    258, 227, 247, 245, 246, 240, 248, 176,
    138, 254, 250, 251, 239, 161, 162, 21,
    76, 212, 213, 214, 215,
    218, 219, 222, 221, 220, 75,
    22, 26, 126, 216, 127,
    157, 252, 158, 159,
    203, 204, 205, 206,
    241, 262, 263, 242, 264, 137, 71,
    182, 183, 260, 259, 184, 85, 256, 261,
    37, 178, 179, 180,
    147, 145, 146, 83,
    185, 187
  ].join(',')).split(',').map(value => Number(value.trim())).filter(Boolean)
};

export function getCutoff(now = Date.now()) {
  if (CONFIG.crawlStartDate) {
    const timestamp = Date.parse(`${CONFIG.crawlStartDate}T00:00:00+08:00`);
    if (Number.isFinite(timestamp)) return Math.floor(timestamp / 1000);
  }
  return Math.floor(now / 1000) - CONFIG.recentDays * 24 * 3600;
}
