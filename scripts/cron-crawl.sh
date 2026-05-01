#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="/root/qlist"
MODE="${1:-early}"
NODE_PATH_PREFIX="$PROJECT_DIR/.node/bin"
LOCK_FILE="$PROJECT_DIR/logs/crawl.lock"
LOG_PREFIX="[$(date '+%Y-%m-%d %H:%M:%S')]"

cd "$PROJECT_DIR"
mkdir -p "$PROJECT_DIR/logs"
export PATH="$NODE_PATH_PREFIX:$PATH"

run_job() {
  case "$MODE" in
    early)
      npm run crawl:early
      ;;
    fast)
      npm run crawl:fast
      ;;
    backfill)
      npm run crawl:backfill
      ;;
    month)
      npm run crawl:month
      ;;
    tags)
      TAG_BACKFILL_LIMIT="${TAG_BACKFILL_LIMIT:-1000}" TAG_BACKFILL_CONCURRENCY="${TAG_BACKFILL_CONCURRENCY:-4}" npm run backfill:tags
      ;;
    *)
      echo "$LOG_PREFIX unknown mode: $MODE"
      echo "usage: $0 {early|fast|backfill|month|tags}"
      exit 2
      ;;
  esac
}

(
  if ! flock -n 9; then
    echo "$LOG_PREFIX skip mode=$MODE reason=locked"
    exit 0
  fi

  echo "$LOG_PREFIX start mode=$MODE"
  run_job
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] done mode=$MODE"
) 9>"$LOCK_FILE"
