Param(
    [switch]$NoStart
)

$ErrorActionPreference = 'SilentlyContinue'

# Ensure we run from the repository root (parent of scripts directory)
try {
    if ($PSScriptRoot) {
        Set-Location (Join-Path $PSScriptRoot '..')
    }
} catch {}

Write-Host "Stopping previous dev sessions..." -ForegroundColor Yellow

# Identify and stop any dev processes launched from this repo, without assuming specific ports
$repoRoot = (Get-Location).Path
$repoRootEsc = [Regex]::Escape($repoRoot)
$devPattern = '(vite|ts-node-dev|concurrently|vite-node|nodemon|ts-node|react-scripts|webpack|next|node)'

function Stop-RepoProcesses() {
	try {
		# Stop processes whose command line references the repo and matches common dev tools
		Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
			Where-Object { $_.CommandLine -and ($_.CommandLine -match $repoRootEsc) -and ($_.CommandLine -match $devPattern) } |
			ForEach-Object {
				$pid = $_.ProcessId
				$cmd = $_.CommandLine
				try {
					Write-Host (" - Stopping PID {0}: {1}" -f $pid, $cmd)
					Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
				} catch {}
			}

		# Additionally, stop any process that is LISTENING and whose command line references this repo
		$pidsWithListeners = @()
		try {
			$pidsWithListeners = (Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
				Select-Object -ExpandProperty OwningProcess -Unique) | Sort-Object -Unique
		} catch {}
		foreach ($pid in $pidsWithListeners) {
			try {
				$procInfo = Get-CimInstance Win32_Process -Filter "ProcessId=$pid" -ErrorAction SilentlyContinue
				if ($procInfo -and $procInfo.CommandLine -and ($procInfo.CommandLine -match $repoRootEsc)) {
					Write-Host (" - Stopping listener PID {0}: {1}" -f $pid, $procInfo.CommandLine)
					Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
				}
			} catch {}
		}
	} catch {}
}

Stop-RepoProcesses

if ($NoStart) {
    Write-Host "Stopped previous sessions. Skipping start due to -NoStart." -ForegroundColor Green
    exit 0
}

Write-Host "Starting fresh dev environment..." -ForegroundColor Cyan

# Prefer user's pnpm install path if available
$pnpmLocal = Join-Path $env:LOCALAPPDATA 'pnpm/pnpm.exe'
if (Test-Path $pnpmLocal) {
    & $pnpmLocal dev
} else {
    # Fallback to PATH-resolved pnpm
    pnpm dev
}


