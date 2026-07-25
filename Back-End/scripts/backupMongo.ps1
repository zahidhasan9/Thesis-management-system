param(
  [string]$OutputDirectory = (Join-Path $PSScriptRoot "..\backups")
)

$resolvedOutput = [System.IO.Path]::GetFullPath($OutputDirectory)
New-Item -ItemType Directory -Force -Path $resolvedOutput | Out-Null

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$archive = Join-Path $resolvedOutput "thesis-management-$timestamp.archive.gz"

if (-not $env:MONGO_URI) {
  $envFile = Join-Path $PSScriptRoot "..\.env"
  if (Test-Path -LiteralPath $envFile) {
    $line = Get-Content -LiteralPath $envFile |
      Where-Object { $_ -match '^MONGO_URI=' } |
      Select-Object -First 1
    if ($line) {
      $env:MONGO_URI = $line.Substring("MONGO_URI=".Length)
    }
  }
}

if (-not $env:MONGO_URI) {
  throw "MONGO_URI is not configured."
}

mongodump --uri="$env:MONGO_URI" --archive="$archive" --gzip
if ($LASTEXITCODE -ne 0) {
  throw "mongodump failed with exit code $LASTEXITCODE."
}

Write-Output "Backup created: $archive"
