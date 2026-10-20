param(
  [ValidateRange(1024, 65535)][int]$Port = 4174,
  [ValidateSet('Loopback', 'Any')][string]$Bind = 'Loopback'
)
$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCmd) {
  $bundledNode = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
  if (Test-Path -LiteralPath $bundledNode) { $nodeCmd = $bundledNode }
}
if (-not $nodeCmd) { throw 'Node.js is required to run this frontend. Install the current Node.js LTS release.' }
$previousPort = $env:PORT
$previousHost = $env:HOST
try {
  $env:PORT = [string]$Port
  $env:HOST = if ($Bind -eq 'Any') { '0.0.0.0' } else { '127.0.0.1' }
  & $nodeCmd (Join-Path $PSScriptRoot 'server.js')
} finally {
  $env:PORT = $previousPort
  $env:HOST = $previousHost
}
