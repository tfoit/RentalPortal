# PowerShell script to kill frontend and backend processes
Write-Host "Stopping RentalPortal servers..." -ForegroundColor Cyan

# Kill by port - Frontend (8080) and Backend (5000)
$frontendPort = 8080
$backendPort = 5000

# Find and kill processes by port
$frontendProcess = Get-NetTCPConnection -LocalPort $frontendPort -ErrorAction SilentlyContinue | 
Select-Object -ExpandProperty OwningProcess -ErrorAction SilentlyContinue
$backendProcess = Get-NetTCPConnection -LocalPort $backendPort -ErrorAction SilentlyContinue | 
Select-Object -ExpandProperty OwningProcess -ErrorAction SilentlyContinue

# Handle frontend processes
if ($frontendProcess) {
    foreach ($processId in $frontendProcess) {
        $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "Stopping frontend process: $($process.ProcessName) (PID: $processId)" -ForegroundColor Yellow
            Stop-Process -Id $processId -Force
            Write-Host "Frontend process stopped." -ForegroundColor Green
        }
    }
}
else {
    Write-Host "No frontend process found on port $frontendPort." -ForegroundColor Gray
}

# Handle backend processes
if ($backendProcess) {
    foreach ($processId in $backendProcess) {
        $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "Stopping backend process: $($process.ProcessName) (PID: $processId)" -ForegroundColor Yellow
            Stop-Process -Id $processId -Force
            Write-Host "Backend process stopped." -ForegroundColor Green
        }
    }
}
else {
    Write-Host "No backend process found on port $backendPort." -ForegroundColor Gray
}

# Additional approach: Kill by process name (node for both frontend and backend)
# This should catch any remaining webpack or nodejs processes related to the application
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
    $_.CommandLine -like "*webpack*" -or 
    $_.CommandLine -like "*rental*" -or 
    $_.CommandLine -like "*frontend*" -or 
    $_.CommandLine -like "*backend*" -or
    $_.CommandLine -like "*server.js*"
}

if ($nodeProcesses) {
    Write-Host "Stopping additional Node.js processes..." -ForegroundColor Yellow
    foreach ($process in $nodeProcesses) {
        Write-Host "Stopping: $($process.Id) - $($process.CommandLine)" -ForegroundColor Yellow
        Stop-Process -Id $process.Id -Force
    }
    Write-Host "Additional Node.js processes stopped." -ForegroundColor Green
}
else {
    Write-Host "No additional Node.js processes found." -ForegroundColor Gray
}

Write-Host "All RentalPortal servers have been stopped." -ForegroundColor Cyan 