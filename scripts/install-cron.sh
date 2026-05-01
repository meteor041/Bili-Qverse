#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="/root/qlist"
CRON_D_FILE="/etc/cron.d/qlist"
SOURCE_FILE="$PROJECT_DIR/scripts/qlist.cron"

if [[ ! -f "$SOURCE_FILE" ]]; then
  echo "missing $SOURCE_FILE" >&2
  exit 1
fi

if [[ $EUID -ne 0 ]]; then
  echo "please run as root: sudo $0" >&2
  exit 1
fi

install -m 0644 "$SOURCE_FILE" "$CRON_D_FILE"

if command -v service >/dev/null 2>&1; then
  service cron reload >/dev/null 2>&1 || service crond reload >/dev/null 2>&1 || true
fi

echo "installed $CRON_D_FILE"
echo "log: $PROJECT_DIR/logs/cron.log"
