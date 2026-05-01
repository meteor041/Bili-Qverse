import { CONFIG, getCutoff } from './config.js';
import { enrichWithDanmaku, mapLimit } from './crawler.js';
import {
  createCrawlRun,
  finishCrawlRun,
  listDanmakuBackfillCandidates,
  recordStatsSnapshot,
  upsertDanmakuDailyStats,
  upsertDanmakuStat
} from './db.js';
import { sleep } from './bilibili.js';

const limit = Number(process.env.BACKFILL_LIMIT || 5000);
const retryAfterMinutes = Number(process.env.BACKFILL_RETRY_AFTER_MINUTES || 30);
const viewThreshold = Number(process.env.BACKFILL_VIEW_THRESHOLD || CONFIG.viewThreshold);
const concurrency = Number(process.env.BACKFILL_CONCURRENCY || CONFIG.videoConcurrency);
const cutoff = getCutoff();

async function main() {
  const runId = await createCrawlRun();
  const videos = await listDanmakuBackfillCandidates({ cutoff, viewThreshold, limit, retryAfterMinutes });
  const summary = { id: runId, candidates: videos.length, scanned: 0, cached: 0, errors: 0 };

  console.log(`[backfill] cutoff=${new Date(cutoff * 1000).toISOString()} threshold=${viewThreshold} limit=${limit} candidates=${videos.length} concurrency=${concurrency} delay=${CONFIG.requestDelayMs}ms retryAfter=${retryAfterMinutes}m`);

  await mapLimit(videos, concurrency, async (video, index) => {
    try {
      const stat = await enrichWithDanmaku(video);
      await upsertDanmakuStat(stat);
      await upsertDanmakuDailyStats(video.bvid, stat.dailyStats, stat.scannedAt);
      summary.scanned += 1;
      console.log(`[dm] ${index + 1}/${videos.length} ${video.bvid} ?=${stat.questionCount} daily=${stat.dailyStats.length}`);
    } catch (error) {
      summary.errors += 1;
      await upsertDanmakuStat({
        bvid: video.bvid,
        cidCount: 0,
        questionCount: 0,
        danmakuCount: 0,
        scannedAt: new Date().toISOString(),
        error: error.message
      });
      console.warn(`[warn] ${index + 1}/${videos.length} ${video.bvid}: ${error.message}`);
    }

    await sleep(CONFIG.requestDelayMs);
  });

  await finishCrawlRun(summary);
  await recordStatsSnapshot({ range: 'day' });
  console.log(`[done] candidates=${summary.candidates} scanned=${summary.scanned} errors=${summary.errors}`);
}

main().then(() => {
  process.exit(0);
}).catch(error => {
  console.error(error);
  process.exit(1);
});
