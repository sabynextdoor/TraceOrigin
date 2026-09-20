# Start the TraceOrigin frontend (Vite dev server) on port 5173.
# Usage:  powershell -ExecutionPolicy Bypass -File .\scripts\start-frontend.ps1

$ErrorActionPreference = "Stop"

$Root     = Split-Path -Parent $PSScriptRoot
$Frontend = Join-Path $Root "frontend"

if (-not (Test-Path (Join-Path $Frontend "package.json"))) {
    Write-Error "Frontend folder not found at $Frontend"
    exit 1
}

if (-not (Test-Path (Join-Path $Frontend "node_modules"))) {
    Write-Host "[TraceOrigin] node_modules missing - installing..." -ForegroundColor Yellow
    Set-Location $Frontend
    npm install
    if ($LASTEXITCODE -ne 0) { Write-Error "npm install failed"; exit $LASTEXITCODE }
}

Set-Location $Frontend
Write-Host "[TraceOrigin] App -> http://localhost:5173  (proxies /api to :8001)" -ForegroundColor Cyan
npm run dev