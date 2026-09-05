$ErrorActionPreference='Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)
$changes = git status --porcelain
if (-not $changes) { exit 0 }
$stamp = Get-Date -Format 'yyyy-MM-dd HH:mm'
git add .
git commit -m "Otomatik güncelleme: $stamp"
git push origin main
