#!/usr/bin/env bash
# POST a Sanity mutations JSON file to the mutate endpoint; prints the response.
# Usage: create-doc.sh <mutations-json-path>
set -euo pipefail

JSON="${1:?usage: create-doc.sh <mutations-json-path>}"
[ -f "$JSON" ] || { echo "ERR: no such file: $JSON" >&2; exit 1; }

PROJECT_ID="izt9f0dq"
DATASET="production"

ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
TOKEN="$(cd "$ROOT/studio" && npx sanity debug --secrets 2>/dev/null | awk '/Auth token:/ {print $3}')"
[ -n "$TOKEN" ] || { echo "ERR: no Sanity auth token — run: (cd studio && npx sanity login)" >&2; exit 1; }

curl -sS -X POST "https://${PROJECT_ID}.api.sanity.io/v2021-06-07/data/mutate/${DATASET}?returnIds=true" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  --data-binary "@${JSON}"
echo
