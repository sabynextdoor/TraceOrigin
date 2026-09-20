#!/usr/bin/env bash
# Start the TraceOrigin frontend (Vite dev server) on port 5173.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND="$ROOT/frontend"

if [[ ! -f "$FRONTEND/package.json" ]]; then
  echo "Frontend folder not found at $FRONTEND" >&2
  exit 1
fi

if [[ ! -d "$FRONTEND/node_modules" ]]; then
  echo "[TraceOrigin] node_modules missing - installing..." >&2
  (cd "$FRONTEND" && npm install)
fi

cd "$FRONTEND"
echo "[TraceOrigin] App -> http://localhost:5173  (proxies /api to :8001)"
exec npm run dev