# Nefol Beauty Brand - Complete System Startup Script (PowerShell)
# This script starts all services: Backend API, Admin Panel, and User Panel

Write-Host "🚀 Starting Nefol Beauty Brand Complete System..." -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Function to check if port is in use
function Test-Port {
    param([int]$Port)
    
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        Write-Host "❌ Port $Port is already in use" -ForegroundColor Red
        return $false
    }
    catch {
        Write-Host "✅ Port $Port is available" -ForegroundColor Green
        return $true
    }
}

# Function to wait for service to be ready
function Wait-ForService {
    param(
        [string]$Url,
        [string]$ServiceName,
        [int]$MaxAttempts = 30
    )
    
    Write-Host "⏳ Waiting for $ServiceName to be ready..." -ForegroundColor Yellow
    
    for ($attempt = 1; $attempt -le $MaxAttempts; $attempt++) {
        try {
            $response = Invoke-WebRequest -Uri $Url -Method Get -TimeoutSec 2 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                Write-Host "✅ $ServiceName is ready!" -ForegroundColor Green
                return $true
            }
        }
        catch {
            Write-Host "   Attempt $attempt/$MaxAttempts - $ServiceName not ready yet" -ForegroundColor Blue
            Start-Sleep -Seconds 2
        }
    }
    
    Write-Host "❌ $ServiceName failed to start within timeout" -ForegroundColor Red
    return $false
}

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Blue

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Check if pnpm is installed
try {
    $pnpmVersion = pnpm --version
    Write-Host "✅ pnpm is installed: $pnpmVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ pnpm is not installed. Please install pnpm first." -ForegroundColor Red
    exit 1
}

# Check ports
Write-Host "🔍 Checking port availability..." -ForegroundColor Blue
if (-not (Test-Port 4000)) { exit 1 }  # Backend API
if (-not (Test-Port 5173)) { exit 1 }  # Admin Panel
if (-not (Test-Port 5174)) { exit 1 }  # User Panel

# Install dependencies if needed
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
pnpm install

# Create .env files if they don't exist
Write-Host "⚙️ Setting up environment files..." -ForegroundColor Blue

if (-not (Test-Path "backend\.env")) {
    Write-Host "⚠️ Creating backend\.env from template" -ForegroundColor Yellow
    Copy-Item "backend\env.example" "backend\.env"
}

if (-not (Test-Path "admin-panel\.env")) {
    Write-Host "⚠️ Creating admin-panel\.env from template" -ForegroundColor Yellow
    Copy-Item "admin-panel\env.example" "admin-panel\.env"
}

if (-not (Test-Path "user-panel\.env")) {
    Write-Host "⚠️ Creating user-panel\.env from template" -ForegroundColor Yellow
    Copy-Item "user-panel\env.example" "user-panel\.env"
}

# Start Backend API
Write-Host "🔧 Starting Backend API Server..." -ForegroundColor Blue
$backendJob = Start-Job -ScriptBlock {
    Set-Location "backend"
    npm run dev
}

# Wait for backend to be ready
Wait-ForService "http://localhost:4000/api/products" "Backend API"

# Start Admin Panel
Write-Host "👨‍💼 Starting Admin Panel..." -ForegroundColor Blue
$adminJob = Start-Job -ScriptBlock {
    Set-Location "admin-panel"
    npm run dev
}

# Wait for admin panel to be ready
Wait-ForService "http://localhost:5173" "Admin Panel"

# Start User Panel
Write-Host "🛍️ Starting User Panel..." -ForegroundColor Blue
$userJob = Start-Job -ScriptBlock {
    Set-Location "user-panel"
    npm run dev
}

# Wait for user panel to be ready
Wait-ForService "http://localhost:5174" "User Panel"

# Success message
Write-Host ""
Write-Host "🎉 All services are running successfully!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
Write-Host "📊 Admin Panel: http://localhost:5173" -ForegroundColor Blue
Write-Host "🛍️ User Panel: http://localhost:5174" -ForegroundColor Blue
Write-Host "🔧 API Server: http://localhost:4000" -ForegroundColor Blue
Write-Host "📚 API Docs: http://localhost:4000/api-docs" -ForegroundColor Blue
Write-Host "==================================================" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Yellow
Write-Host "• Press Ctrl+C to stop all services"
Write-Host "• Check logs in individual terminal windows"
Write-Host "• Visit the API Manager in admin panel to configure integrations"
Write-Host "• Use the Setup Guide (SETUP_GUIDE.md) for detailed configuration"
Write-Host ""

# Function to cleanup on exit
function Stop-AllServices {
    Write-Host "🛑 Stopping all services..." -ForegroundColor Yellow
    Stop-Job $backendJob -ErrorAction SilentlyContinue
    Stop-Job $adminJob -ErrorAction SilentlyContinue
    Stop-Job $userJob -ErrorAction SilentlyContinue
    Remove-Job $backendJob -ErrorAction SilentlyContinue
    Remove-Job $adminJob -ErrorAction SilentlyContinue
    Remove-Job $userJob -ErrorAction SilentlyContinue
    Write-Host "✅ All services stopped" -ForegroundColor Green
    exit 0
}

# Set up signal handlers
$null = Register-EngineEvent PowerShell.Exiting -Action { Stop-AllServices }

# Keep script running
Write-Host "🔄 Services are running. Press Ctrl+C to stop all services." -ForegroundColor Green

try {
    while ($true) {
        Start-Sleep -Seconds 1
        
        # Check if any job has failed
        if ($backendJob.State -eq "Failed" -or $adminJob.State -eq "Failed" -or $userJob.State -eq "Failed") {
            Write-Host "ERROR: One or more services have failed. Stopping all services." -ForegroundColor Red
            Stop-AllServices
        }
    }
}
catch {
    Stop-AllServices
}
