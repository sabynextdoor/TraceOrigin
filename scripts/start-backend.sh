#!/usr/bin/env bash
# Start the TraceOrigin backend (FastAPI + uvicorn) on port 8001.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND="$ROOT/backend"
VENV_PY="$BACKEND/.venv/bin/python"

if [[ ! -d "$BACKEND" ]]; then
  echo "Backend folder not found at $BACKEND" >&2
  exit 1
fi

cd "$BACKEND"

if [[ -x "$VENV_PY" ]]; then
  PYTHON="$VENV_PY"
  echo "[TraceOrigin] Using virtual env: $PYTHON"
else
  PYTHON=python3
  echo "[TraceOrigin] WARNING: backend/.venv not found, using system python." >&2
  echo "[TraceOrigin] Create it with:  python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt" >&2
fi

echo "[TraceOrigin] API -> http://localhost:8001  (frontend proxy: /api)"
exec "$PYTHON" -m uvicorn app.main:app --reload --port 8001