$ErrorActionPreference='Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)
$changes=@(git status --porcelain)
if(-not $changes){exit 0}
$hasCode=$changes | Where-Object {$_ -match '\.((html?)|(css)|(js)|(svg)|(png))$'}
$hasReadme=$changes | Where-Object {$_ -match 'README\.md$'}
if($hasCode -and -not $hasReadme){Write-Error 'Kod değişti ama README.md güncellenmedi. Önce README proje notunu güncelle.';exit 2}
$stamp=Get-Date -Format 'yyyy-MM-dd HH:mm'
git add .
git commit -m "Otomatik güncelleme: $stamp"
git push origin main
