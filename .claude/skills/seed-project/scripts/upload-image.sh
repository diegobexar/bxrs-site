#!/usr/bin/env bash
# Upload a local image to Sanity as an asset; prints the asset _id on stdout.
# Usage: upload-image.sh <path-to-image>
set -euo pipefail

IMG="${1:?usage: upload-image.sh <image-path>}"
[ -f "$IMG" ] || { echo "ERR: no such file: $IMG" >&2; exit 1; }

PROJECT_ID="izt9f0dq"
DATASET="production"

# Resolve the repo root from this script's location (.claude/skills/seed-project/scripts/).
ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
TOKEN="$(cd "$ROOT/studio" && npx sanity debug --secrets 2>/dev/null | awk '/Auth token:/ {print $3}')"
[ -n "$TOKEN" ] || { echo "ERR: no Sanity auth token — run: (cd studio && npx sanity login)" >&2; exit 1; }

ext="$(printf '%s' "${IMG##*.}" | tr 'A-Z' 'a-z')"
case "$ext" in
  jpg|jpeg) ct="image/jpeg" ;;
  png)      ct="image/png"  ;;
  webp)     ct="image/webp" ;;
  gif)      ct="image/gif"  ;;
  *) echo "ERR: unsupported image extension .$ext" >&2; exit 1 ;;
esac

curl -sS -X POST "https://${PROJECT_ID}.api.sanity.io/v2021-06-07/assets/images/${DATASET}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: ${ct}" \
  --data-binary "@${IMG}" \
  | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{const j=JSON.parse(d);if(!j.document||!j.document._id){console.error("upload failed: "+d);process.exit(1)}process.stdout.write(j.document._id)})'
