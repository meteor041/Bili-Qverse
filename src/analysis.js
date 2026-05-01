import { CONFIG } from './config.js';
import { fetchDanmakuXml, fetchVideoReplies, fetchVideoTags, fetchVideoView, hasQuestion, parseDanmakuXml, sleep } from './bilibili.js';
import { getAnalysisCache, getDanmakuTimeline, upsertAnalysisCache, upsertDanmakuDailyStats, upsertVideo } from './db.js';

const QUESTION_KEYWORDS = ['怎么', '为什么', '为何', '啥', '什么', '哪里', '哪儿', '谁', '吗', '呢', '是否', '有没有', '难道'];
const STOP_WORDS = new Set(['这个', '那个', '什么', '怎么', '为什么', '感觉', '不是', '真的', '还是', '没有', '可以', '就是', '这么', '这么多']);

function asVideoItem(data) {
  const duration = Number(data.duration || 0) || (Array.isArray(data.pages) ? data.pages.reduce((sum, page) => sum + Number(page.duration || 0), 0) : 0);
  const tags = Array.isArray(data.tags) ? data.tags : [];
  return {
    bvid: data.bvid,
    aid: data.aid || null,
    title: data.title || '',
    author: data.owner?.name || '',
    mid: data.owner?.mid || null,
    rid: data.tid || null,
    tname: data.tname || '',
    tags,
    pubdate: Number(data.pubdate || 0),
    view: Number(data.stat?.view || 0),
    duration: Number.isFinite(duration) ? duration : 0,
    pic: data.pic || '',
    url: `https://www.bilibili.com/video/${data.bvid}`
  };
}

function isCacheFresh(cached) {
  if (!cached?.analyzedAt) return false;
  if (!Array.isArray(cached.payload?.tags)) return false;
  const analyzedAt = new Date(cached.analyzedAt).getTime();
  if (!Number.isFinite(analyzedAt)) return false;
  return Date.now() - analyzedAt < CONFIG.analysisCacheTtlHours * 3600 * 1000;
}

const refreshTasks = new Set();

function refreshInBackground(bvid) {
  if (refreshTasks.has(bvid)) return;
  refreshTasks.add(bvid);
  analyzeVideo(bvid, { force: true })
    .catch(error => console.warn(`[analysis refresh] ${bvid}: ${error.message}`))
    .finally(() => refreshTasks.delete(bvid));
}

function questionLike(value) {
  return hasQuestion(value) || QUESTION_KEYWORDS.some(keyword => value.includes(keyword));
}

function bucketDanmaku(danmakuItems, page, bucketSeconds) {
  const buckets = new Map();
  const samples = [];

  for (const item of danmakuItems) {
    const bucketStart = Math.floor(item.time / bucketSeconds) * bucketSeconds;
    const key = `${page.cid}:${bucketStart}`;
    const bucket = buckets.get(key) || {
      cid: page.cid,
      page: page.page,
      part: page.part || `P${page.page}`,
      start: bucketStart,
      end: bucketStart + bucketSeconds,
      totalCount: 0,
      questionCount: 0,
      samples: []
    };

    bucket.totalCount += 1;
    if (item.isQuestion) {
      bucket.questionCount += 1;
      if (bucket.samples.length < 5) bucket.samples.push(item.content);
      if (samples.length < 50) samples.push({ cid: page.cid, page: page.page, time: item.time, content: item.content });
    }

    buckets.set(key, bucket);
  }

  return { buckets: [...buckets.values()], samples };
}

function extractWords(text) {
  return text
    .replace(/[a-zA-Z0-9_]+/g, ' ')
    .split(/[\s，。！？、,.!?：:；;（）()【】\[\]《》<>"'“”‘’]+/)
    .map(word => word.trim())
    .filter(word => word.length >= 2 && !STOP_WORDS.has(word));
}

function addWordCounts(counter, text) {
  for (const keyword of QUESTION_KEYWORDS) {
    if (text.includes(keyword)) counter.set(keyword, (counter.get(keyword) || 0) + 1);
  }

  for (const word of extractWords(text)) {
    counter.set(word, (counter.get(word) || 0) + 1);
  }
}

function flattenReplies(replies = []) {
  const items = [];
  for (const reply of replies) {
    items.push(reply);
    if (Array.isArray(reply.replies)) items.push(...reply.replies);
  }
  return items;
}

async function analyzeComments(aid) {
  const wordCounts = new Map();
  const questionComments = [];
  let totalComments = 0;
  let loadedComments = 0;

  for (let pn = 1; pn <= CONFIG.commentPages; pn += 1) {
    const json = await fetchVideoReplies(aid, pn, CONFIG.commentPageSize);
    const replies = flattenReplies(json.data?.replies || []);
    totalComments = Number(json.data?.page?.count || totalComments || 0);

    if (replies.length === 0) break;

    for (const reply of replies) {
      const message = reply.content?.message || '';
      if (!message) continue;
      loadedComments += 1;

      if (questionLike(message)) {
        addWordCounts(wordCounts, message);
        if (questionComments.length < 30) {
          questionComments.push({
            rpid: reply.rpid,
            mid: reply.mid,
            uname: reply.member?.uname || '',
            like: Number(reply.like || 0),
            ctime: Number(reply.ctime || 0),
            message
          });
        }
      }
    }

    await sleep(CONFIG.requestDelayMs);
  }

  const topWords = [...wordCounts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 30)
    .map(([word, count]) => ({ word, count }));

  return {
    totalComments,
    loadedComments,
    questionComments: questionComments.length,
    questionRate: loadedComments > 0 ? questionComments.length / loadedComments : 0,
    topWords,
    samples: questionComments
  };
}

async function analyzeDanmakuTimeline(pages) {
  const allBuckets = [];
  const allSamples = [];
  const dailyStats = new Map();
  let danmakuCount = 0;
  let questionCount = 0;

  for (const page of pages) {
    if (!page.cid) continue;
    const xml = await fetchDanmakuXml(page.cid);
    const items = parseDanmakuXml(xml);
    const { buckets, samples } = bucketDanmaku(items, page, CONFIG.timelineBucketSeconds);

    danmakuCount += items.length;
    questionCount += items.filter(item => item.isQuestion).length;
    for (const item of items) {
      if (!item.sendTime) continue;
      const statDate = new Date(item.sendTime * 1000).toISOString().slice(0, 10);
      const stat = dailyStats.get(statDate) || { statDate, questionCount: 0, danmakuCount: 0 };
      stat.danmakuCount += 1;
      if (item.isQuestion) stat.questionCount += 1;
      dailyStats.set(statDate, stat);
    }
    allBuckets.push(...buckets);
    allSamples.push(...samples);
    await sleep(CONFIG.requestDelayMs);
  }

  const timeline = allBuckets
    .filter(bucket => bucket.questionCount > 0)
    .sort((left, right) => right.questionCount - left.questionCount || left.start - right.start)
    .slice(0, 200)
    .map(bucket => ({
      ...bucket,
      questionRate: bucket.totalCount > 0 ? bucket.questionCount / bucket.totalCount : 0
    }));

  return {
    bucketSeconds: CONFIG.timelineBucketSeconds,
    danmakuCount,
    questionCount,
    questionRate: danmakuCount > 0 ? questionCount / danmakuCount : 0,
    dailyStats: [...dailyStats.values()],
    timeline,
    samples: allSamples.slice(0, 50)
  };
}

export async function analyzeVideo(bvid, { force = false } = {}) {
  const cached = await getAnalysisCache(bvid);
  if (!force && isCacheFresh(cached)) return { ...cached.payload, cached: true };
  if (!force && cached?.payload) {
    const timeline = await getDanmakuTimeline(bvid, cached.payload.danmaku?.bucketSeconds || CONFIG.timelineBucketSeconds);
    const payload = timeline.length > 0 ? {
      ...cached.payload,
      danmaku: {
        ...cached.payload.danmaku,
        timeline
      }
    } : cached.payload;
    refreshInBackground(bvid);
    return { ...payload, cached: true, stale: true };
  }

  const viewJson = await fetchVideoView(bvid);
  const video = viewJson.data;
  if (!video?.bvid || !video?.aid) throw new Error(`Video not found: ${bvid}`);

  const tagJson = await fetchVideoTags(bvid).catch(() => ({ data: [] }));
  const tags = (Array.isArray(tagJson.data) ? tagJson.data : []).map(tag => tag.tag_name || tag.name).filter(Boolean).slice(0, 20);

  await upsertVideo(asVideoItem({ ...video, tags }));

  const [danmaku, comments] = await Promise.all([
    analyzeDanmakuTimeline(video.pages || []),
    analyzeComments(video.aid).catch(error => ({
      error: error.message,
      totalComments: 0,
      loadedComments: 0,
      questionComments: 0,
      questionRate: 0,
      topWords: [],
      samples: []
    }))
  ]);

  const payload = {
    bvid: video.bvid,
    aid: video.aid,
    title: video.title,
    author: video.owner?.name || '',
    tname: video.tname || '',
    tags,
    pubdate: Number(video.pubdate || 0),
    view: Number(video.stat?.view || 0),
    duration: Number(video.duration || 0) || (video.pages || []).reduce((sum, page) => sum + Number(page.duration || 0), 0),
    reply: Number(video.stat?.reply || 0),
    danmakuTotal: Number(video.stat?.danmaku || 0),
    pages: (video.pages || []).map(page => ({ cid: page.cid, page: page.page, part: page.part, duration: page.duration })),
    analyzedAt: new Date().toISOString(),
    cached: false,
    danmaku,
    comments
  };

  await upsertAnalysisCache(bvid, payload);
  await upsertDanmakuDailyStats(bvid, danmaku.dailyStats, payload.analyzedAt);
  return payload;
}
