@echo off
setlocal enabledelayedexpansion

REM ==============================================================================
REM Aderion Studio — Universal Windows Build Runner (Command Prompt)
REM Supports: Windows 10 / 11 / Server
REM Engine Priority: Podman -> Docker -> Native Node/npm
REM ==============================================================================

set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

set "COMMAND=%~1"
if "%COMMAND%"=="" set "COMMAND=build"

REM Check for Podman
where podman >nul 2>nul
if %errorlevel% equ 0 (
    set "ENGINE=podman"
    goto :EXECUTE
)

REM Check for Docker
where docker >nul 2>nul
if %errorlevel% equ 0 (
    set "ENGINE=docker"
    goto :EXECUTE
)

REM Check for native npm
where npm >nul 2>nul
if %errorlevel% equ 0 (
    set "ENGINE=native"
    goto :EXECUTE
)

set "ENGINE=none"

:EXECUTE
echo ==================================================
echo  Aderion Studio Build Runner (Windows)
echo  Detected Engine: %ENGINE%
echo  Target Command:  %COMMAND%
echo ==================================================

if "%ENGINE%"=="podman" (
    podman ps --format "{{.Names}}" 2>nul | findstr /r "^website-dev$" >nul
    if !errorlevel! equ 0 (
        echo [INFO] Executing inside running 'website-dev' Podman container...
        if "%COMMAND%"=="install" (
            podman exec -i website-dev npm install
        ) else (
            podman exec -i website-dev npm run %COMMAND%
        )
    ) else (
        echo [INFO] Running via ephemeral node:20-alpine Podman container...
        if "%COMMAND%"=="install" (
            podman run --rm -v "%PROJECT_DIR%:/workspace:z" -w /workspace node:20-alpine npm install
        ) else (
            podman run --rm -v "%PROJECT_DIR%:/workspace:z" -w /workspace node:20-alpine npm run %COMMAND%
        )
    )
    goto :DONE
)

if "%ENGINE%"=="docker" (
    docker ps --format "{{.Names}}" 2>nul | findstr /r "^website-dev$" >nul
    if !errorlevel! equ 0 (
        echo [INFO] Executing inside running 'website-dev' Docker container...
        if "%COMMAND%"=="install" (
            docker exec -i website-dev npm install
        ) else (
            docker exec -i website-dev npm run %COMMAND%
        )
    ) else (
        echo [INFO] Running via ephemeral node:20-alpine Docker container...
        if "%COMMAND%"=="install" (
            docker run --rm -v "%PROJECT_DIR%:/workspace" -w /workspace node:20-alpine npm install
        ) else (
            docker run --rm -v "%PROJECT_DIR%:/workspace" -w /workspace node:20-alpine npm run %COMMAND%
        )
    )
    goto :DONE
)

if "%ENGINE%"=="native" (
    echo [INFO] Executing via host system npm...
    if "%COMMAND%"=="install" (
        npm install
    ) else (
        npm run %COMMAND%
    )
    goto :DONE
)

echo [HATA] Sistemde Podman, Docker veya Node.js/npm bulunamadi!
echo Lutfen asagidakilerden birini kurun:
echo 1) Podman Desktop: https://podman-desktop.io/
echo 2) Docker Desktop: https://www.docker.com/
echo 3) Node.js (v20+): https://nodejs.org/
exit /b 1

:DONE
echo [OK] Tamamlandi!
exit /b 0
