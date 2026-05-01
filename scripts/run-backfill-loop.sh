#!/usr/bin/env bash
set -u
cd /root/qlist

while true; do
  PATH=/root/qlist/.node/bin:$PATH \
  CRAWL_START_DATE=2026-01-01 \
  BACKFILL_VIEW_THRESHOLD=10000 \
  BACKFILL_LIMIT=500 \
  BACKFILL_CONCURRENCY=4 \
  PAGE_CONCURRENCY=2 \
  REQUEST_DELAY_MS=700 \
  FETCH_RETRIES=1 \
  BACKFILL_RETRY_AFTER_MINUTES=120 \
  npm run backfill:danmaku

  echo "[loop] batch done at $(date -Is), sleep 20s"
  sleep 20
done
