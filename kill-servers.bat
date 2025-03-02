@echo off
echo Stopping RentalPortal servers...
powershell -ExecutionPolicy Bypass -File "%~dp0kill-servers.ps1"
echo Done!
pause 