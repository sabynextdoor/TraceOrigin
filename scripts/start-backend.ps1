# Start the TraceOrigin backend (FastAPI + uvicorn) on port 8001.
# Usage:  powershell -ExecutionPolicy Bypass -File .\scripts\start-backend.ps1

$ErrorActionPreference = "Stop"

$Root   = Split-Path -Parent $PSScriptRoot
$Backend = Join-Path $Root "backend"
$VenvPy  = Join-Path $Backend ".venv\Scripts\python.exe"

if (-not (Test-Path $Backend)) {
    Write-Error "Backend folder not found at $Backend"
    exit 1
}

Set-Location $Backend

if (Test-Path $VenvPy) {
    $Python = $VenvPy
    Write-Host "[TraceOrigin] Using virtual env: $Python" -ForegroundColor Cyan
} else {
    $Python = "python"
    Write-Host "[TraceOrigin] WARNING: backend\.venv not found, using system python." -ForegroundColor Yellow
    Write-Host "[TraceOrigin] Create it with:  python -m venv .venv && .\.venv\Scripts\activate && pip install -r requirements.txt" -ForegroundColor Yellow
}

Write-Host "[TraceOrigin] API -> http://localhost:8001  (frontend proxy: /api)" -ForegroundColor Cyan
& $Python -m uvicorn app.main:app --reload --port 8001