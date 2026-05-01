import pg from 'pg';
import { createClient } from 'redis';
import { CONFIG } from './config.js';

const { Pool } = pg;

let pool;
let redisClient;
let initPromise;
let redisPromise;
let redisDisabled = false;
const refreshLocks = new Set();

function nowIso() {
  return new Date().toISOString();
}

function jsonTags(tags) {
  if (Array.isArray(tags)) return JSON.stringify(tags.slice(0, 20).map(sanitizeText));
  if (typeof tags === 'string') return tags.replace(/\u0000/g, '') || '[]';
  return '[]';
}

function sanitizeText(value) {
  return String(value || '').replace(/\u0000/g, '');
}

function sanitizeImageUrl(value) {
  const text = sanitizeText(value).trim();
  if (text.startsWith('//')) return `https:${text}`;
  return text.replace(/^http:\/\/i([0-9])\.hdslb\.com\//i, 'https://i$1.hdslb.com/');
}

function cacheKey(...parts) {
  return ['qlist', ...parts].join(':');
}

async function getRedis() {
  if (!CONFIG.redisUrl || redisDisabled) return null;
  if (redisClient?.isOpen) return redisClient;
  if (!redisPromise) {
    redisClient = createClient({ url: CONFIG.redisUrl });
    redisClient.on('error', error => {
      if (!redisDisabled) console.warn(`[redis] ${error.message}`);
      redisDisabled = true;
    });
    redisPromise = redisClient.connect().catch(error => {
      console.warn(`[redis] disabled: ${error.message}`);
      redisDisabled = true;
      return null;
    });
  }
  await redisPromise;
  return redisClient?.isOpen ? redisClient : null;
}

async function cacheGet(key) {
  const redis = await getRedis();
  if (!redis) return null;
  const value = await redis.get(key).catch(() => null);
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

async function cacheSet(key, value, ttlSeconds) {
  const redis = await getRedis();
  if (!redis) return;
  await redis.set(key, JSON.stringify(value), { EX: ttlSeconds }).catch(() => {});
}

async function cacheDel(key) {
  const redis = await getRedis();
  if (!redis) return;
  await redis.del(key).catch(() => {});
}

export async function getDb() {
  if (!pool) {
    const parsedUrl = new URL(CONFIG.postgresUrl);
    const sslEnabled = ['postgresql:', 'postgres:'].includes(parsedUrl.protocol) && (parsedUrl.searchParams.has('sslmode') || parsedUrl.hostname.includes('supabase'));
    pool = new Pool({
      host: parsedUrl.hostname,
      port: Number(parsedUrl.port || 5432),
      database: decodeURIComponent(parsedUrl.pathname.replace(/^\//, '') || 'postgres'),
      user: decodeURIComponent(parsedUrl.username),
      password: decodeURIComponent(parsedUrl.password),
      ssl: sslEnabled ? { rejectUnauthorized: CONFIG.postgresSslRejectUnauthorized } : undefined
    });
  }
  if (!initPromise) initPromise = migrate();
  await initPromise;
  return pool;
}

async function query(sql, params = []) {
  const db = await getDb();
  return db.query(sql, params);
}

async function migrate() {
  const db = pool;
  await db.query(`
    CREATE TABLE IF NOT EXISTS videos (
      bvid TEXT PRIMARY KEY,
      aid BIGINT,
      title TEXT NOT NULL DEFAULT '',
      author TEXT NOT NULL DEFAULT '',
      mid BIGINT,
      rid INTEGER,
      tname TEXT NOT NULL DEFAULT '',
      tags JSONB NOT NULL DEFAULT '[]'::jsonb,
      pubdate INTEGER NOT NULL DEFAULT 0,
      view BIGINT NOT NULL DEFAULT 0,
      duration INTEGER NOT NULL DEFAULT 0,
      pic TEXT NOT NULL DEFAULT '',
      url TEXT NOT NULL DEFAULT '',
      first_seen_at TEXT NOT NULL,
      last_seen_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS danmaku_stats (
      bvid TEXT PRIMARY KEY REFERENCES videos(bvid) ON DELETE CASCADE,
      cid_count INTEGER NOT NULL DEFAULT 0,
      question_count INTEGER NOT NULL DEFAULT 0,
      danmaku_count INTEGER NOT NULL DEFAULT 0,
      scanned_at TEXT NOT NULL,
      error TEXT
    );

    CREATE TABLE IF NOT EXISTS video_danmaku_daily_stats (
      bvid TEXT NOT NULL REFERENCES videos(bvid) ON DELETE CASCADE,
      stat_date DATE NOT NULL,
      question_count INTEGER NOT NULL DEFAULT 0,
      danmaku_count INTEGER NOT NULL DEFAULT 0,
      scanned_at TEXT NOT NULL,
      PRIMARY KEY (bvid, stat_date)
    );

    CREATE TABLE IF NOT EXISTS crawl_runs (
      id BIGSERIAL PRIMARY KEY,
      started_at TEXT NOT NULL,
      finished_at TEXT,
      candidates INTEGER NOT NULL DEFAULT 0,
      scanned INTEGER NOT NULL DEFAULT 0,
      cached INTEGER NOT NULL DEFAULT 0,
      errors INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS video_analysis_cache (
      bvid TEXT PRIMARY KEY,
      payload JSONB NOT NULL,
      analyzed_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS video_danmaku_timeline (
      bvid TEXT NOT NULL REFERENCES videos(bvid) ON DELETE CASCADE,
      bucket_seconds INTEGER NOT NULL,
      bucket_start INTEGER NOT NULL,
      bucket_end INTEGER NOT NULL,
      question_count INTEGER NOT NULL DEFAULT 0,
      total_count INTEGER NOT NULL DEFAULT 0,
      question_rate DOUBLE PRECISION NOT NULL DEFAULT 0,
      samples JSONB NOT NULL DEFAULT '[]'::jsonb,
      analyzed_at TEXT NOT NULL,
      PRIMARY KEY (bvid, bucket_seconds, bucket_start)
    );

    CREATE TABLE IF NOT EXISTS stats_snapshots (
      id BIGSERIAL PRIMARY KEY,
      range TEXT NOT NULL,
      range_days INTEGER,
      video_count INTEGER NOT NULL DEFAULT 0,
      total_question_count BIGINT NOT NULL DEFAULT 0,
      total_danmaku_count BIGINT NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_videos_pubdate ON videos(pubdate);
    CREATE INDEX IF NOT EXISTS idx_videos_last_seen_at ON videos(last_seen_at);
    CREATE INDEX IF NOT EXISTS idx_videos_view ON videos(view);
    CREATE INDEX IF NOT EXISTS idx_danmaku_question_count ON danmaku_stats(question_count DESC);
    CREATE INDEX IF NOT EXISTS idx_video_danmaku_daily_stats_date ON video_danmaku_daily_stats(stat_date DESC);
    CREATE INDEX IF NOT EXISTS idx_video_danmaku_daily_stats_question ON video_danmaku_daily_stats(question_count DESC);
    CREATE INDEX IF NOT EXISTS idx_stats_snapshots_range_created ON stats_snapshots(range, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_video_danmaku_timeline_bvid_start ON video_danmaku_timeline(bvid, bucket_seconds, bucket_start);
  `);
}

function normalizeSort(sort) {
  if (['count', 'rate', 'score'].includes(sort)) return sort;
  return 'score';
}

function normalizeRange(range) {
  if (['day', 'week', 'month', 'all'].includes(range)) return range;
  return 'week';
}

function getRangeDays(range) {
  return {
    day: 1,
    week: 7,
    month: 30,
    all: null
  }[normalizeRange(range)];
}

function getCutoffForRange(range, now = Date.now()) {
  const rangeDays = getRangeDays(range);
  if (rangeDays === null) return null;
  return Math.floor(now / 1000) - rangeDays * 24 * 3600;
}

function getCutoffDateForRange(range, now = Date.now()) {
  const cutoff = getCutoffForRange(range, now);
  if (cutoff === null) return null;
  return new Date(cutoff * 1000).toISOString().slice(0, 10);
}

function withRankingMetrics(item) {
  const questionCount = Number(item.questionCount || 0);
  const danmakuCount = Number(item.danmakuCount || 0);
  const view = Number(item.view || 0);
  const questionRate = danmakuCount > 0 ? questionCount / danmakuCount : 0;
  const effectiveRate = questionCount / (danmakuCount + 50);
  const rateBoost = 1 + 2 * (1 - Math.exp(-5 * effectiveRate));
  const confusionScore = Math.sqrt(questionCount) * Math.log10(view + 10) * rateBoost;

  return {
    ...item,
    questionRate,
    effectiveRate,
    rateBoost,
    confusionScore
  };
}

function sortRankingItems(items, sort) {
  const normalizedSort = normalizeSort(sort);

  return [...items].sort((left, right) => {
    if (normalizedSort === 'rate') {
      return right.questionRate - left.questionRate || right.questionCount - left.questionCount || right.view - left.view;
    }

    if (normalizedSort === 'count') {
      return right.questionCount - left.questionCount || right.view - left.view;
    }

    return right.confusionScore - left.confusionScore || right.questionCount - left.questionCount || right.view - left.view;
  });
}

export async function getAnalysisCache(bvid) {
  const redisKey = cacheKey('analysis', bvid);
  const cachedPayload = await cacheGet(redisKey);
  if (cachedPayload) return cachedPayload;

  const { rows } = await query('SELECT bvid, payload, analyzed_at FROM video_analysis_cache WHERE bvid = $1', [bvid]);
  const cached = rows[0];
  if (!cached) return null;

  const result = {
    bvid: cached.bvid,
    payload: cached.payload,
    analyzedAt: cached.analyzed_at
  };
  await cacheSet(redisKey, result, CONFIG.analysisCacheTtlHours * 3600);
  return result;
}

export async function upsertAnalysisCache(bvid, payload) {
  const analyzedAt = nowIso();
  await query(`
    INSERT INTO video_analysis_cache (bvid, payload, analyzed_at)
    VALUES ($1, $2::jsonb, $3)
    ON CONFLICT(bvid) DO UPDATE SET
      payload = EXCLUDED.payload,
      analyzed_at = EXCLUDED.analyzed_at
  `, [bvid, JSON.stringify(payload), analyzedAt]);
  await upsertDanmakuTimeline(bvid, payload.danmaku, analyzedAt);
  await cacheSet(cacheKey('analysis', bvid), { bvid, payload, analyzedAt }, CONFIG.analysisCacheTtlHours * 3600);
}

export async function getDanmakuTimeline(bvid, bucketSeconds = CONFIG.timelineBucketSeconds) {
  const redisKey = cacheKey('timeline', bvid, bucketSeconds);
  const cached = await cacheGet(redisKey);
  if (cached) return cached;

  const { rows } = await query(`
    SELECT
      bucket_start AS "start",
      bucket_end AS "end",
      question_count AS "questionCount",
      total_count AS "totalCount",
      question_rate AS "questionRate",
      samples,
      analyzed_at AS "analyzedAt"
    FROM video_danmaku_timeline
    WHERE bvid = $1 AND bucket_seconds = $2
    ORDER BY bucket_start ASC
  `, [bvid, bucketSeconds]);
  await cacheSet(redisKey, rows, CONFIG.analysisCacheTtlHours * 3600);
  return rows;
}

export async function upsertDanmakuTimeline(bvid, danmaku, analyzedAt = nowIso()) {
  if (!danmaku?.timeline || !Array.isArray(danmaku.timeline)) return;
  const bucketSeconds = Number(danmaku.bucketSeconds || CONFIG.timelineBucketSeconds);
  await query('DELETE FROM video_danmaku_timeline WHERE bvid = $1 AND bucket_seconds = $2', [bvid, bucketSeconds]);

  for (const bucket of danmaku.timeline) {
    await query(`
      INSERT INTO video_danmaku_timeline (
        bvid, bucket_seconds, bucket_start, bucket_end, question_count, total_count, question_rate, samples, analyzed_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9)
      ON CONFLICT (bvid, bucket_seconds, bucket_start) DO UPDATE SET
        bucket_end = EXCLUDED.bucket_end,
        question_count = EXCLUDED.question_count,
        total_count = EXCLUDED.total_count,
        question_rate = EXCLUDED.question_rate,
        samples = EXCLUDED.samples,
        analyzed_at = EXCLUDED.analyzed_at
    `, [
      bvid,
      bucketSeconds,
      Number(bucket.start || 0),
      Number(bucket.end || 0),
      Number(bucket.questionCount || 0),
      Number(bucket.totalCount || 0),
      Number(bucket.questionRate || 0),
      JSON.stringify(Array.isArray(bucket.samples) ? bucket.samples.slice(0, 5) : []),
      analyzedAt
    ]);
  }

  await cacheDel(cacheKey('timeline', bvid, bucketSeconds));
}

export async function upsertVideo(video) {
  const seenAt = nowIso();
  await query(`
    INSERT INTO videos (bvid, aid, title, author, mid, rid, tname, tags, pubdate, view, duration, pic, url, first_seen_at, last_seen_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10, $11, $12, $13, $14, $14, $14)
    ON CONFLICT(bvid) DO UPDATE SET
      aid = EXCLUDED.aid,
      title = EXCLUDED.title,
      author = EXCLUDED.author,
      mid = EXCLUDED.mid,
      rid = EXCLUDED.rid,
      tname = EXCLUDED.tname,
      tags = EXCLUDED.tags,
      pubdate = EXCLUDED.pubdate,
      view = EXCLUDED.view,
      duration = EXCLUDED.duration,
      pic = EXCLUDED.pic,
      url = EXCLUDED.url,
      last_seen_at = EXCLUDED.last_seen_at,
      updated_at = EXCLUDED.updated_at
  `, [
    video.bvid,
    video.aid || null,
    sanitizeText(video.title),
    sanitizeText(video.author),
    video.mid || null,
    video.rid || null,
    sanitizeText(video.tname),
    jsonTags(video.tags),
    Number(video.pubdate || 0),
    Number(video.view || 0),
    Number(video.duration || 0),
    sanitizeImageUrl(video.pic),
    sanitizeText(video.url),
    seenAt
  ]);
}

export async function getDanmakuStat(bvid) {
  const { rows } = await query('SELECT * FROM danmaku_stats WHERE bvid = $1', [bvid]);
  return rows[0] || null;
}

export async function upsertDanmakuStat(stat) {
  await query(`
    INSERT INTO danmaku_stats (bvid, cid_count, question_count, danmaku_count, scanned_at, error)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT(bvid) DO UPDATE SET
      cid_count = EXCLUDED.cid_count,
      question_count = EXCLUDED.question_count,
      danmaku_count = EXCLUDED.danmaku_count,
      scanned_at = EXCLUDED.scanned_at,
      error = EXCLUDED.error
  `, [
    stat.bvid,
    Number(stat.cidCount || stat.cid_count || 0),
    Number(stat.questionCount || stat.question_count || 0),
    Number(stat.danmakuCount || stat.danmaku_count || 0),
    stat.scannedAt || stat.scanned_at || nowIso(),
    stat.error || null
  ]);
}

export async function upsertDanmakuDailyStats(bvid, dailyStats = [], scannedAt = nowIso()) {
  for (const stat of dailyStats) {
    if (!stat?.statDate) continue;
    await query(`
      INSERT INTO video_danmaku_daily_stats (bvid, stat_date, question_count, danmaku_count, scanned_at)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (bvid, stat_date) DO UPDATE SET
        question_count = EXCLUDED.question_count,
        danmaku_count = EXCLUDED.danmaku_count,
        scanned_at = EXCLUDED.scanned_at
    `, [
      bvid,
      stat.statDate,
      Number(stat.questionCount || 0),
      Number(stat.danmakuCount || 0),
      scannedAt
    ]);
  }
}

export async function createCrawlRun() {
  const { rows } = await query('INSERT INTO crawl_runs (started_at) VALUES ($1) RETURNING id', [nowIso()]);
  return Number(rows[0].id);
}

export async function finishCrawlRun(summary) {
  await query(`
    UPDATE crawl_runs
    SET finished_at = $1, candidates = $2, scanned = $3, cached = $4, errors = $5
    WHERE id = $6
  `, [nowIso(), summary.candidates || 0, summary.scanned || 0, summary.cached || 0, summary.errors || 0, summary.id]);
}

export async function getStatsSummary({ range = 'day' } = {}) {
  const normalizedRange = normalizeRange(range);
  const rangeDays = getRangeDays(normalizedRange);
  const cutoffDate = rangeDays === null ? null : getCutoffDateForRange(normalizedRange);
  const redisKey = cacheKey('stats', normalizedRange);
  const cached = await cacheGet(redisKey);
  if (cached) return cached;

  const params = rangeDays === null ? [CONFIG.viewThreshold] : [cutoffDate, CONFIG.viewThreshold];
  const sql = rangeDays === null ? `
    SELECT
      COUNT(*) AS "videoCount",
      COALESCE(SUM(danmaku_stats.question_count), 0) AS "totalQuestionCount",
      COALESCE(SUM(danmaku_stats.danmaku_count), 0) AS "totalDanmakuCount"
    FROM videos
    JOIN danmaku_stats ON danmaku_stats.bvid = videos.bvid
    WHERE videos.view >= $1
  ` : `
    SELECT
      COUNT(DISTINCT videos.bvid) AS "videoCount",
      COALESCE(SUM(video_danmaku_daily_stats.question_count), 0) AS "totalQuestionCount",
      COALESCE(SUM(video_danmaku_daily_stats.danmaku_count), 0) AS "totalDanmakuCount"
    FROM videos
    JOIN video_danmaku_daily_stats ON video_danmaku_daily_stats.bvid = videos.bvid
    WHERE video_danmaku_daily_stats.stat_date >= $1::date AND videos.view >= $2
  `;
  const { rows } = await query(sql, params);
  const row = rows[0] || {};
  const videoCount = Number(row.videoCount || 0);
  const totalQuestionCount = Number(row.totalQuestionCount || 0);
  const totalDanmakuCount = Number(row.totalDanmakuCount || 0);

  const summary = {
    range: normalizedRange,
    rangeDays,
    videoCount,
    totalQuestionCount,
    totalDanmakuCount,
    questionRate: totalDanmakuCount > 0 ? totalQuestionCount / totalDanmakuCount : 0,
    updatedAt: nowIso()
  };
  await cacheSet(redisKey, summary, CONFIG.statsCacheSeconds);
  return summary;
}

export async function recordStatsSnapshot({ range = 'day' } = {}) {
  const summary = await getStatsSummary({ range });
  await query(`
    INSERT INTO stats_snapshots (range, range_days, video_count, total_question_count, total_danmaku_count, created_at)
    VALUES ($1, $2, $3, $4, $5, $6)
  `, [summary.range, summary.rangeDays, summary.videoCount, summary.totalQuestionCount, summary.totalDanmakuCount, summary.updatedAt]);
  await cacheDel(cacheKey('stats', summary.range));
  await cacheDel(cacheKey('realtime'));
  return summary;
}

export async function getRealtimeStats() {
  const redisKey = cacheKey('realtime');
  const cached = await cacheGet(redisKey);
  if (cached) return cached;

  const current = await getStatsSummary({ range: 'day' });
  const { rows: snapshots } = await query(`
    SELECT * FROM stats_snapshots
    WHERE range = $1
    ORDER BY id DESC
    LIMIT 2
  `, ['day']);
  const latest = snapshots[0] || null;
  const previous = snapshots[1] || null;
  const base = previous || latest;
  const deltaQuestionCount = base ? Math.max(0, current.totalQuestionCount - Number(base.total_question_count || 0)) : 0;
  const deltaDanmakuCount = base ? Math.max(0, current.totalDanmakuCount - Number(base.total_danmaku_count || 0)) : 0;

  const result = {
    ...current,
    snapshotAt: latest?.created_at || null,
    previousSnapshotAt: previous?.created_at || null,
    lastDeltaQuestionCount: deltaQuestionCount,
    lastDeltaDanmakuCount: deltaDanmakuCount,
    lastDeltaQuestionRate: deltaDanmakuCount > 0 ? deltaQuestionCount / deltaDanmakuCount : 0
  };
  await cacheSet(redisKey, result, CONFIG.statsCacheSeconds);
  return result;
}

export async function estimateQuestionScore(text) {
  const value = String(text || '').trim();
  const questionMarks = (value.match(/[?？]/g) || []).length;
  const keywordHits = ['怎么', '为什么', '为何', '啥', '什么', '哪里', '谁', '吗', '呢', '是否', '有没有', '难道']
    .filter(keyword => value.includes(keyword)).length;
  const titleRows = (await getRankingPayload({ range: 'all', sort: 'score', limit: 100 })).items;
  const similar = titleRows.filter(item => value && item.title.includes(value.slice(0, 4))).length;
  const base = questionMarks * 18 + keywordHits * 12 + Math.min(value.length, 80) * 0.35 + similar * 5;
  const score = Math.max(1, Math.min(100, Math.round(base)));

  return {
    input: value,
    score,
    questionMarks,
    keywordHits,
    similarCount: similar,
    sampleSize: titleRows.length,
    source: 'postgres-history'
  };
}

export async function getRankingPayload({ cutoff, limit = CONFIG.rankingLimit, sort = 'score', range = 'week' } = {}) {
  const normalizedSort = normalizeSort(sort);
  const normalizedRange = normalizeRange(range);
  const rangeDays = getRangeDays(normalizedRange);
  const effectiveCutoff = rangeDays === null ? null : cutoff ?? getCutoffForRange(normalizedRange);
  const effectiveCutoffDate = rangeDays === null ? null : new Date(effectiveCutoff * 1000).toISOString().slice(0, 10);
  const safeLimit = Math.max(1, Math.min(Number(limit) || CONFIG.rankingLimit, 500));
  const candidateLimit = Math.max(safeLimit * 10, 1000);
  const redisKey = cacheKey('ranking', normalizedRange, normalizedSort, safeLimit, effectiveCutoff || 'all');
  const cached = await cacheGet(redisKey);
  if (cached) return cached;

  const { rows: runRows } = await query('SELECT * FROM crawl_runs ORDER BY id DESC LIMIT 1');
  const latestRun = runRows[0] || null;
  const rows = normalizedRange === 'all' ? (await query(`
    SELECT
      videos.bvid,
      videos.aid,
      videos.title,
      videos.author,
      videos.mid,
      videos.rid,
      videos.tname,
      videos.tags,
      videos.pubdate,
      videos.view,
      videos.duration,
      videos.pic,
      videos.url,
      videos.first_seen_at AS "firstSeenAt",
      videos.last_seen_at AS "lastSeenAt",
      danmaku_stats.cid_count AS "cidCount",
      danmaku_stats.question_count AS "questionCount",
      danmaku_stats.danmaku_count AS "danmakuCount",
      danmaku_stats.scanned_at AS "scannedAt",
      danmaku_stats.error
    FROM videos
    JOIN danmaku_stats ON danmaku_stats.bvid = videos.bvid
    WHERE videos.view >= $1
    ORDER BY danmaku_stats.question_count DESC, videos.view DESC
    LIMIT $2
  `, [CONFIG.viewThreshold, candidateLimit])).rows : (await query(`
    SELECT
      videos.bvid,
      videos.aid,
      videos.title,
      videos.author,
      videos.mid,
      videos.rid,
      videos.tname,
      videos.tags,
      videos.pubdate,
      videos.view,
      videos.duration,
      videos.pic,
      videos.url,
      videos.first_seen_at AS "firstSeenAt",
      videos.last_seen_at AS "lastSeenAt",
      0 AS "cidCount",
      COALESCE(SUM(video_danmaku_daily_stats.question_count), 0) AS "questionCount",
      COALESCE(SUM(video_danmaku_daily_stats.danmaku_count), 0) AS "danmakuCount",
      MAX(video_danmaku_daily_stats.scanned_at) AS "scannedAt",
      NULL AS error
    FROM videos
    JOIN video_danmaku_daily_stats ON video_danmaku_daily_stats.bvid = videos.bvid
    WHERE video_danmaku_daily_stats.stat_date >= $1::date AND videos.view >= $2
    GROUP BY videos.bvid
    ORDER BY COALESCE(SUM(video_danmaku_daily_stats.question_count), 0) DESC, videos.view DESC
    LIMIT $3
  `, [effectiveCutoffDate, CONFIG.viewThreshold, candidateLimit])).rows;
  const items = rows.map(withRankingMetrics);

  const payload = {
    generatedAt: latestRun?.finished_at || null,
    config: {
      recentDays: CONFIG.recentDays,
      range: normalizedRange,
      rangeDays,
      viewThreshold: CONFIG.viewThreshold,
      sort: normalizedSort,
      rids: [...new Set(CONFIG.rids)]
    },
    run: latestRun,
    items: sortRankingItems(items, normalizedSort).slice(0, safeLimit)
  };
  await cacheSet(redisKey, payload, CONFIG.rankingCacheSeconds);
  return payload;
}

export async function getHotTags({ range = 'week', limit = 16 } = {}) {
  const normalizedRange = normalizeRange(range);
  const rangeDays = getRangeDays(normalizedRange);
  const effectiveCutoffDate = getCutoffDateForRange(normalizedRange);
  const safeLimit = Math.max(1, Math.min(Number(limit) || 16, 50));
  const redisKey = cacheKey('tags', 'hot', normalizedRange, safeLimit, effectiveCutoffDate || 'all');
  const cached = await cacheGet(redisKey);
  if (cached && (normalizedRange === 'all' || cached.items?.length > 0)) return cached;

  let sourceRange = normalizedRange;
  let rows = normalizedRange === 'all' ? (await query(`
    WITH video_scores AS (
      SELECT
        videos.bvid,
        videos.tags,
        videos.view,
        danmaku_stats.question_count,
        danmaku_stats.danmaku_count
      FROM videos
      JOIN danmaku_stats ON danmaku_stats.bvid = videos.bvid
      WHERE jsonb_typeof(videos.tags) = 'array' AND jsonb_array_length(videos.tags) > 0
    )
    SELECT
      tag.name AS tag,
      COUNT(*)::int AS "videoCount",
      COALESCE(SUM(video_scores.question_count), 0)::bigint AS "questionCount",
      COALESCE(SUM(video_scores.danmaku_count), 0)::bigint AS "danmakuCount",
      COALESCE(SUM(video_scores.view), 0)::bigint AS "viewCount"
    FROM video_scores
    CROSS JOIN LATERAL (
      SELECT trim(both '#' from trim(value)) AS name
      FROM jsonb_array_elements_text(video_scores.tags) AS tags(value)
    ) AS tag
    WHERE tag.name <> ''
    GROUP BY tag.name
    ORDER BY COALESCE(SUM(video_scores.question_count), 0) DESC, COUNT(*) DESC
    LIMIT $1
  `, [safeLimit])).rows : (await query(`
    WITH video_scores AS (
      SELECT
        videos.bvid,
        videos.tags,
        MAX(videos.view) AS view,
        COALESCE(SUM(video_danmaku_daily_stats.question_count), 0) AS question_count,
        COALESCE(SUM(video_danmaku_daily_stats.danmaku_count), 0) AS danmaku_count
      FROM videos
      JOIN video_danmaku_daily_stats ON video_danmaku_daily_stats.bvid = videos.bvid
      WHERE video_danmaku_daily_stats.stat_date >= $1::date
        AND jsonb_typeof(videos.tags) = 'array'
        AND jsonb_array_length(videos.tags) > 0
      GROUP BY videos.bvid
    )
    SELECT
      tag.name AS tag,
      COUNT(*)::int AS "videoCount",
      COALESCE(SUM(video_scores.question_count), 0)::bigint AS "questionCount",
      COALESCE(SUM(video_scores.danmaku_count), 0)::bigint AS "danmakuCount",
      COALESCE(SUM(video_scores.view), 0)::bigint AS "viewCount"
    FROM video_scores
    CROSS JOIN LATERAL (
      SELECT trim(both '#' from trim(value)) AS name
      FROM jsonb_array_elements_text(video_scores.tags) AS tags(value)
    ) AS tag
    WHERE tag.name <> ''
    GROUP BY tag.name
    ORDER BY COALESCE(SUM(video_scores.question_count), 0) DESC, COUNT(*) DESC
    LIMIT $2
  `, [effectiveCutoffDate, safeLimit])).rows;

  if (rows.length === 0 && normalizedRange !== 'all') {
    sourceRange = 'all';
    rows = (await query(`
      WITH video_scores AS (
        SELECT
          videos.bvid,
          videos.tags,
          videos.view,
          danmaku_stats.question_count,
          danmaku_stats.danmaku_count
        FROM videos
        JOIN danmaku_stats ON danmaku_stats.bvid = videos.bvid
        WHERE jsonb_typeof(videos.tags) = 'array' AND jsonb_array_length(videos.tags) > 0
      )
      SELECT
        tag.name AS tag,
        COUNT(*)::int AS "videoCount",
        COALESCE(SUM(video_scores.question_count), 0)::bigint AS "questionCount",
        COALESCE(SUM(video_scores.danmaku_count), 0)::bigint AS "danmakuCount",
        COALESCE(SUM(video_scores.view), 0)::bigint AS "viewCount"
      FROM video_scores
      CROSS JOIN LATERAL (
        SELECT trim(both '#' from trim(value)) AS name
        FROM jsonb_array_elements_text(video_scores.tags) AS tags(value)
      ) AS tag
      WHERE tag.name <> ''
      GROUP BY tag.name
      ORDER BY COALESCE(SUM(video_scores.question_count), 0) DESC, COUNT(*) DESC
      LIMIT $1
    `, [safeLimit])).rows;
  }

  const items = rows.map(row => ({
    tag: row.tag.startsWith('#') ? row.tag : `#${row.tag}`,
    videoCount: Number(row.videoCount || 0),
    questionCount: Number(row.questionCount || 0),
    danmakuCount: Number(row.danmakuCount || 0),
    viewCount: Number(row.viewCount || 0),
    questionRate: Number(row.danmakuCount || 0) > 0 ? Number(row.questionCount || 0) / Number(row.danmakuCount || 0) : 0
  }));

  const payload = {
    generatedAt: nowIso(),
    config: {
      range: normalizedRange,
      sourceRange,
      rangeDays,
      limit: safeLimit
    },
    items
  };
  await cacheSet(redisKey, payload, CONFIG.rankingCacheSeconds);
  return payload;
}

export async function listVideosMissingTags(limit = 200) {
  const { rows } = await query(`
    SELECT bvid, title
    FROM videos
    WHERE tags IS NULL OR tags = '[]'::jsonb
    ORDER BY view DESC, updated_at DESC
    LIMIT $1
  `, [Math.max(1, Number(limit) || 200)]);
  return rows;
}

export async function updateVideoTags(bvid, tags) {
  await query('UPDATE videos SET tags = $1::jsonb, updated_at = $2 WHERE bvid = $3', [jsonTags(tags), nowIso(), bvid]);
}

export async function closeDb() {
  if (redisClient?.isOpen) await redisClient.quit().catch(() => {});
  if (pool) await pool.end();
  redisClient = null;
  redisPromise = null;
  pool = null;
  initPromise = null;
}
