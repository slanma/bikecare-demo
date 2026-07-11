#!/bin/zsh
set -u

REPO="$(cd "$(dirname "$0")/.." && pwd)"
STATE_DIR="$REPO/.git/auto-push"
LOG_FILE="$STATE_DIR/auto-push.log"
LAST_FILE="$STATE_DIR/last-pushed"
LOCK_DIR="$STATE_DIR/lock"

mkdir -p "$STATE_DIR"

if ! mkdir "$LOCK_DIR" 2>/dev/null; then
  exit 0
fi
trap 'rmdir "$LOCK_DIR" 2>/dev/null || true' EXIT

cd "$REPO" || exit 1
CURRENT="$(git rev-parse HEAD 2>/dev/null)" || exit 1
LAST="$(cat "$LAST_FILE" 2>/dev/null || true)"

if [[ "$CURRENT" == "$LAST" ]]; then
  exit 0
fi

{
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Odesílám commit $CURRENT"
  if git push origin main; then
    echo "$CURRENT" > "$LAST_FILE"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Push dokončen"
  else
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Push selhal; další pokus za 30 sekund"
    exit 1
  fi
} >> "$LOG_FILE" 2>&1
