import { CONFIG, getCutoff } from './config.js';
import { countQuestionDanmaku, fetchDanmakuXml, fetchNewlist, fetchVideoTags, fetchVideoView, sleep } from './bilibili.js';
import { createCrawlRun, finishCrawlRun, getDanmakuStat, getRankingPayload, recordStatsSnapshot, upsertDanmakuDailyStats, upsertDanmakuStat, upsertVideo } from './db.js';

function uniqueNumbers(values) {
  return [...new Set(values)].filter(Number.isFinite);
}

export function asVideoItem(video, fallbackRid) {
  const duration = Number(video.duration || 0);
  const tags = Array.isArray(video.tags) ? video.tags : [];
  return {
    bvid: video.bvid,
    aid: video.aid || null,
    title: video.title || '',
    author: video.owner?.name || video.author || '',
    mid: video.owner?.mid || video.mid || null,
    rid: video.tid || fallbackRid,
    tname: video.tname || video.typename || '',
    tags,
    pubdate: Number(video.pubdate || 0),
    view: Number(video.stat?.view || video.play || 0),
    duration: Number.isFinite(duration) ? duration : 0,
    pic: video.pic || '',
    url: `https://www.bilibili.com/video/${video.bvid}`
  };
}

function isFreshStat(stat) {
  if (CONFIG.forceRescan) return false;
  if (!stat?.scanned_at) return false;
  const scannedAt = new Date(stat.scanned_at).getTime();
  if (!Number.isFinite(scannedAt)) return false;
  const maxAgeMs = CONFIG.danmakuCacheTtlHours * 3600 * 1000;
  return Date.now() - scannedAt < maxAgeMs;
}

function shouldScanDanmaku(video, nowSeconds = Math.floor(Date.now() / 1000)) {
  if (video.view >= CONFIG.viewThreshold) return true;
  if (CONFIG.earlyWindowHours <= 0) return false;

  const earlyCutoff = nowSeconds - CONFIG.earlyWindowHours * 3600;
  return video.pubdate >= earlyCutoff && video.view >= CONFIG.earlyViewThreshold;
}

export async function mapLimit(items, concurrency, worker) {
  const queue = [...items.entries()];
  const workerCount = Math.max(1, Math.min(concurrency, queue.length));

  await Promise.all(Array.from({ length: workerCount }, async () => {
    while (queue.length > 0) {
      const next = queue.shift();
      if (!next) return;
      const [index, item] = next;
      await worker(item, index);
    }
  }));
}

async function collectRecentHotVideos() {
  const cutoff = getCutoff();
  const nowSeconds = Math.floor(Date.now() / 1000);
  const result = new Map();
  const rids = uniqueNumbers(CONFIG.rids);

  await mapLimit(rids, CONFIG.ridConcurrency, async rid => {
    console.log(`[newlist] rid=${rid}`);

    for (let pn = 1; pn <= CONFIG.maxPagesPerRid; pn += 1) {
      console.log(`[newlist] rid=${rid} pn=${pn}`);

      let json;
      try {
        json = await fetchNewlist(rid, pn, CONFIG.pageSize);
      } catch (error) {
        console.warn(`[warn] newlist rid=${rid} pn=${pn}: ${error.message}`);
        break;
      }

      const archives = json.data?.archives || [];
      if (archives.length === 0) break;

      let reachedOldVideo = false;
      for (const video of archives) {
        const pubdate = Number(video.pubdate || 0);
        const view = Number(video.stat?.view || video.play || 0);

        if (pubdate < cutoff) {
          reachedOldVideo = true;
          continue;
        }

        if (video.bvid) {
          const item = asVideoItem(video, rid);
          await upsertVideo(item);

          if (shouldScanDanmaku(item, nowSeconds)) {
            result.set(video.bvid, item);
          }
        }
      }

      if (reachedOldVideo) break;
      await sleep(CONFIG.requestDelayMs);
    }
  });

  return [...result.values()];
}

export async function enrichWithDanmaku(video) {
  const viewJson = await fetchVideoView(video.bvid);
  const tagJson = await fetchVideoTags(video.bvid).catch(() => ({ data: [] }));
  const tags = (Array.isArray(tagJson.data) ? tagJson.data : []).map(tag => tag.tag_name || tag.name).filter(Boolean).slice(0, 20);
  await upsertVideo(asVideoItem({ ...viewJson.data, tags }, video.rid));
  const pages = viewJson.data?.pages || [];
  let questionCount = 0;
  let danmakuCount = 0;
  const dailyStats = new Map();

  await mapLimit(pages, CONFIG.pageConcurrency, async page => {
    if (!page.cid) return;
    const xml = await fetchDanmakuXml(page.cid);
    const counted = countQuestionDanmaku(xml);
    questionCount += counted.questionCount;
    danmakuCount += counted.danmakuCount;
    for (const daily of counted.dailyStats || []) {
      const stat = dailyStats.get(daily.statDate) || { statDate: daily.statDate, questionCount: 0, danmakuCount: 0 };
      stat.questionCount += Number(daily.questionCount || 0);
      stat.danmakuCount += Number(daily.danmakuCount || 0);
      dailyStats.set(daily.statDate, stat);
    }
    await sleep(CONFIG.requestDelayMs);
  });

  return {
    bvid: video.bvid,
    cidCount: pages.length,
    questionCount,
    danmakuCount,
    dailyStats: [...dailyStats.values()],
    scannedAt: new Date().toISOString(),
    error: null
  };
}

export async function crawl() {
  const runId = await createCrawlRun();
  console.log(`[config] cutoff=${new Date(getCutoff() * 1000).toISOString()} startDate=${CONFIG.crawlStartDate || '-'} forceRescan=${CONFIG.forceRescan ? '1' : '0'} ridConcurrency=${CONFIG.ridConcurrency} videoConcurrency=${CONFIG.videoConcurrency} pageConcurrency=${CONFIG.pageConcurrency} delay=${CONFIG.requestDelayMs}ms`);
  const videos = await collectRecentHotVideos();
  const summary = { id: runId, candidates: videos.length, scanned: 0, cached: 0, errors: 0 };

  console.log(`[collect] candidates=${videos.length}`);

  await mapLimit(videos, CONFIG.videoConcurrency, async (video, index) => {
    const cached = await getDanmakuStat(video.bvid);

    if (isFreshStat(cached)) {
      summary.cached += 1;
      console.log(`[cache] ${index + 1}/${videos.length} ${video.bvid}`);
      return;
    }

    try {
      const stat = await enrichWithDanmaku(video);
      await upsertDanmakuStat(stat);
      await upsertDanmakuDailyStats(video.bvid, stat.dailyStats, stat.scannedAt);
      summary.scanned += 1;
      console.log(`[dm] ${index + 1}/${videos.length} ${video.bvid} ?=${stat.questionCount}`);
    } catch (error) {
      summary.errors += 1;
      console.warn(`[warn] ${video.bvid}: ${error.message}`);
      await upsertDanmakuStat({
        bvid: video.bvid,
        cidCount: cached?.cid_count || 0,
        questionCount: cached?.question_count || 0,
        danmakuCount: cached?.danmaku_count || 0,
        scannedAt: cached?.scanned_at || new Date().toISOString(),
        error: error.message
      });
    }

    await sleep(CONFIG.requestDelayMs);
  });

  await finishCrawlRun(summary);
  await recordStatsSnapshot({ range: 'day' });
  return getRankingPayload({ cutoff: getCutoff(), range: 'week' });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  crawl()
    .then(payload => console.log(`[done] items=${payload.items.length} pg=${CONFIG.postgresUrl.replace(/:[^:@/]+@/, ':***@')} redis=${CONFIG.redisUrl}`))
    .catch(error => {
      console.error(error);
      process.exitCode = 1;
    });
}
