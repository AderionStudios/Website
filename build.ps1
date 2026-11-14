<#
.SYNOPSIS
    Aderion Studio — Universal Windows PowerShell Build Runner
    Supports: Windows 10 / 11, macOS, Linux (PowerShell Core)
    Engine Priority: Podman -> Docker -> Native Node/npm
#>
[CmdletBinding()]
param (
    [Parameter(Position = 0)]
    [string]$Command = "build",
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$ExtraArgs
)

$ErrorActionPreference = "Stop"
$ProjectDir = $PSScriptRoot

Set-Location -Path $ProjectDir

# Detect execution engine
$Engine = "none"
if (Get-Command podman -ErrorAction SilentlyContinue) {
    $Engine = "podman"
} elseif (Get-Command docker -ErrorAction SilentlyContinue) {
    $Engine = "docker"
} elseif (Get-Command npm -ErrorAction SilentlyContinue) {
    $Engine = "native"
}

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " Aderion Studio Build Runner (PowerShell)" -ForegroundColor Cyan
Write-Host " Detected Engine: $Engine" -ForegroundColor Yellow
Write-Host " Target Command:  $Command" -ForegroundColor Yellow
Write-Host "==================================================" -ForegroundColor Cyan

switch ($Engine) {
    "podman" {
        $isRunning = (podman ps --format "{{.Names}}" 2>$null) -split "`n" | Where-Object { $_.Trim() -eq "website-dev" }
        if ($isRunning) {
            Write-Host "➔ Executing inside running 'website-dev' Podman container..." -ForegroundColor Green
            if ($Command -in @("install", "ci")) {
                podman exec -i website-dev npm $Command $ExtraArgs
            } else {
                podman exec -i website-dev npm run $Command $ExtraArgs
            }
        } else {
            Write-Host "➔ Running via ephemeral node:20-alpine Podman container..." -ForegroundColor Green
            if ($Command -in @("install", "ci")) {
                podman run --rm -v "${ProjectDir}:/workspace:z" -w /workspace node:20-alpine npm $Command $ExtraArgs
            } else {
                podman run --rm -v "${ProjectDir}:/workspace:z" -w /workspace node:20-alpine npm run $Command $ExtraArgs
            }
        }
    }
    "docker" {
        $isRunning = (docker ps --format "{{.Names}}" 2>$null) -split "`n" | Where-Object { $_.Trim() -eq "website-dev" }
        if ($isRunning) {
            Write-Host "➔ Executing inside running 'website-dev' Docker container..." -ForegroundColor Green
            if ($Command -in @("install", "ci")) {
                docker exec -i website-dev npm $Command $ExtraArgs
            } else {
                docker exec -i website-dev npm run $Command $ExtraArgs
            }
        } else {
            Write-Host "➔ Running via ephemeral node:20-alpine Docker container..." -ForegroundColor Green
            if ($Command -in @("install", "ci")) {
                docker run --rm -v "${ProjectDir}:/workspace" -w /workspace node:20-alpine npm $Command $ExtraArgs
            } else {
                docker run --rm -v "${ProjectDir}:/workspace" -w /workspace node:20-alpine npm run $Command $ExtraArgs
            }
        }
    }
    "native" {
        Write-Host "➔ Executing via host system Node.js / npm..." -ForegroundColor Green
        if ($Command -in @("install", "ci")) {
            npm $Command $ExtraArgs
        } else {
            npm run $Command $ExtraArgs
        }
    }
    default {
        Write-Host "❌ HATA: Sistemde Podman, Docker veya Node.js/npm bulunamadı!" -ForegroundColor Red
        Write-Host "   Lütfen aşağıdakilerden birini kurun:"
        Write-Host "   1) Podman Desktop: https://podman-desktop.io/"
        Write-Host "   2) Docker Desktop: https://www.docker.com/"
        Write-Host "   3) Node.js (v20+): https://nodejs.org/"
        exit 1
    }
}

Write-Host "✓ Tamamlandı!" -ForegroundColor Green
