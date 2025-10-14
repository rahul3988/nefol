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

# Common development ports used by this project
$devPorts = @(3000, 4000, 5173, 5174, 8080, 3001, 4001)

function Check-And-Kill-Ports() {
	Write-Host "Checking for processes using development ports..." -ForegroundColor Yellow
	
	foreach ($port in $devPorts) {
		try {
			$connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
			if ($connections) {
				Write-Host "Port $port is in use. Killing processes..." -ForegroundColor Red
				$connections | ForEach-Object {
					$pid = $_.OwningProcess
					try {
						$procInfo = Get-CimInstance Win32_Process -Filter "ProcessId=$pid" -ErrorAction SilentlyContinue
						if ($procInfo) {
							Write-Host (" - Killing process on port {0} (PID {1}): {2}" -f $port, $pid, $procInfo.CommandLine)
							Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
						}
					} catch {
						Write-Host (" - Failed to kill PID {0}" -f $pid) -ForegroundColor Red
					}
				}
			} else {
				Write-Host "Port $port is free" -ForegroundColor Green
			}
		} catch {
			Write-Host "Error checking port $port" -ForegroundColor Red
		}
	}
}

function Stop-RepoProcesses() {
	try {
		Write-Host "Stopping development processes..." -ForegroundColor Yellow
		
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

		# Stop any Node.js processes that might be running
		Get-Process -Name "node" -ErrorAction SilentlyContinue | ForEach-Object {
			try {
				Write-Host (" - Killing Node.js process PID {0}" -f $_.Id)
				Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
			} catch {}
		}

		# Stop any ts-node-dev processes
		Get-Process -Name "ts-node-dev" -ErrorAction SilentlyContinue | ForEach-Object {
			try {
				Write-Host (" - Killing ts-node-dev process PID {0}" -f $_.Id)
				Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
			} catch {}
		}

		# Stop any Vite processes
		Get-Process -Name "vite" -ErrorAction SilentlyContinue | ForEach-Object {
			try {
				Write-Host (" - Killing Vite process PID {0}" -f $_.Id)
				Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
			} catch {}
		}

	} catch {}
}

# First check and kill any processes using development ports
Check-And-Kill-Ports

# Then stop repository-specific processes
Stop-RepoProcesses

# Wait a moment for ports to be fully released
Write-Host "Waiting for ports to be released..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Final verification - check if ports are still in use
Write-Host "Final port check..." -ForegroundColor Yellow
$busyPorts = @()
foreach ($port in $devPorts) {
    try {
        $connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
        if ($connections) {
            $busyPorts += $port
            Write-Host "Port $port is still busy!" -ForegroundColor Red
        } else {
            Write-Host "Port $port is now free" -ForegroundColor Green
        }
    } catch {}
}

if ($busyPorts.Count -gt 0) {
    Write-Host "Warning: Ports still in use after cleanup: $($busyPorts -join ', ')" -ForegroundColor Red
    Write-Host "Attempting to force kill remaining processes..." -ForegroundColor Red
    
    # Force kill any remaining processes on these ports
    foreach ($port in $busyPorts) {
        try {
            $connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
            $connections | ForEach-Object {
                $pid = $_.OwningProcess
                try {
                    Write-Host (" - Force killing PID {0} on port {1}" -f $pid, $port)
                    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                } catch {}
            }
        } catch {}
    }
    
    Start-Sleep -Seconds 2
}

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


