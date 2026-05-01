import { fetchVideoTags, sleep } from './bilibili.js';
import { CONFIG } from './config.js';
import { listVideosMissingTags, updateVideoTags } from './db.js';

const limit = Math.max(1, Number(process.env.TAG_BACKFILL_LIMIT || 200));
const concurrency = Math.max(1, Math.min(Number(process.env.TAG_BACKFILL_CONCURRENCY || 4), 16));

function extractTags(json) {
  return (Array.isArray(json?.data) ? json.data : [])
    .map(tag => tag?.tag_name || tag?.name)
    .filter(Boolean)
    .slice(0, 20);
}

async function mapLimit(items, workerCount, worker) {
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(workerCount, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      await worker(items[index], index);
    }
  }));
}

async function main() {
  const rows = await listVideosMissingTags(limit);
  const summary = { total: rows.length, updated: 0, empty: 0, errors: 0 };

  console.log(`[tags] candidates=${rows.length} concurrency=${concurrency}`);

  await mapLimit(rows, concurrency, async (row, index) => {
    try {
      const json = await fetchVideoTags(row.bvid);
      const tags = extractTags(json);
      await updateVideoTags(row.bvid, tags);
      if (tags.length > 0) summary.updated += 1;
      else summary.empty += 1;
      console.log(`[tags] ${index + 1}/${rows.length} ${row.bvid} ${tags.join(',') || '-'}`);
      await sleep(CONFIG.requestDelayMs);
    } catch (error) {
      summary.errors += 1;
      console.warn(`[warn] ${row.bvid}: ${error.message}`);
    }
  });

  console.log(`[done] total=${summary.total} updated=${summary.updated} empty=${summary.empty} errors=${summary.errors}`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
