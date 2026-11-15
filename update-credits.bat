@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
    py -3 "scripts\update-credits.py" %*
) else (
    python "scripts\update-credits.py" %*
)
if errorlevel 1 (
    echo [INFO] Some images could not be downloaded. Check your connection and the GitHub repository.
    exit /b 1
)
echo [OK] Credits images and local fallback were updated.
exit /b 0
