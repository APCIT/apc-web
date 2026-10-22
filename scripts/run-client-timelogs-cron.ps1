# Monday client timelog auto-send (local / Task Scheduler).
# Requires: npm run dev (or production server) listening on $BaseUrl
# Optional args: -Force  (bypass Monday-only check for testing)

param(
  [string]$BaseUrl = "http://localhost:3000",
  [switch]$Force
)

$ErrorActionPreference = "Stop"
# Script lives in <repo>/scripts — repo root is parent of scripts
$repoRoot = Split-Path $PSScriptRoot -Parent
Set-Location $repoRoot

$envLine = Get-Content (Join-Path $repoRoot ".env") -ErrorAction Stop |
  Where-Object { $_ -match '^\s*CRON_SECRET=' } |
  Select-Object -First 1

if (-not $envLine) {
  throw "CRON_SECRET not found in .env"
}

$secret = ($envLine -replace '^\s*CRON_SECRET=', '').Trim().Trim('"').Trim("'")
if (-not $secret) {
  throw "CRON_SECRET is empty"
}

$uri = "$BaseUrl/api/cron/client-timelogs"
if ($Force) { $uri += "?force=1" }

$logDir = Join-Path $repoRoot ".data"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$logFile = Join-Path $logDir "client-timelogs-cron.log"

try {
  $result = Invoke-RestMethod -Uri $uri -Headers @{ Authorization = "Bearer $secret" } -Method GET
  $line = "$(Get-Date -Format o) OK $($result | ConvertTo-Json -Compress)"
  Add-Content -Path $logFile -Value $line
  Write-Output $line
} catch {
  $line = "$(Get-Date -Format o) FAIL $($_.Exception.Message)"
  Add-Content -Path $logFile -Value $line
  throw
}
