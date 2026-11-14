#!/usr/bin/env bash
# ==============================================================================
# Aderion Studio — Universal Build & Task Runner
# Supports: Linux & macOS
# Engine Priority: Podman -> Docker -> Native Node/npm
# ==============================================================================
set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

COMMAND="${1:-build}"
shift 2>/dev/null || true

# Determine execution engine
if command -v podman >/dev/null 2>&1; then
  ENGINE="podman"
elif command -v docker >/dev/null 2>&1; then
  ENGINE="docker"
elif command -v npm >/dev/null 2>&1; then
  ENGINE="native"
else
  ENGINE="none"
fi

echo "=================================================="
echo " Aderion Studio Build Runner"
echo " Detected Engine: $ENGINE"
echo " Target Command:  $COMMAND"
echo "=================================================="

case "$ENGINE" in
  podman)
    if podman ps --format "{{.Names}}" 2>/dev/null | grep -q "^website-dev$"; then
      echo "➔ Executing inside running 'website-dev' Podman container..."
      if [ "$COMMAND" = "install" ] || [ "$COMMAND" = "ci" ]; then
        podman exec -i website-dev npm "$COMMAND" "$@"
      else
        podman exec -i website-dev npm run "$COMMAND" "$@"
      fi
    else
      echo "➔ Running via ephemeral node:20-alpine Podman container..."
      if [ "$COMMAND" = "install" ] || [ "$COMMAND" = "ci" ]; then
        podman run --rm -v "$PROJECT_DIR:/workspace:z" -w /workspace node:20-alpine npm "$COMMAND" "$@"
      else
        podman run --rm -v "$PROJECT_DIR:/workspace:z" -w /workspace node:20-alpine npm run "$COMMAND" "$@"
      fi
    fi
    ;;

  docker)
    if docker ps --format "{{.Names}}" 2>/dev/null | grep -q "^website-dev$"; then
      echo "➔ Executing inside running 'website-dev' Docker container..."
      if [ "$COMMAND" = "install" ] || [ "$COMMAND" = "ci" ]; then
        docker exec -i website-dev npm "$COMMAND" "$@"
      else
        docker exec -i website-dev npm run "$COMMAND" "$@"
      fi
    else
      echo "➔ Running via ephemeral node:20-alpine Docker container..."
      if [ "$COMMAND" = "install" ] || [ "$COMMAND" = "ci" ]; then
        docker run --rm -v "$PROJECT_DIR:/workspace" -w /workspace node:20-alpine npm "$COMMAND" "$@"
      else
        docker run --rm -v "$PROJECT_DIR:/workspace" -w /workspace node:20-alpine npm run "$COMMAND" "$@"
      fi
    fi
    ;;

  native)
    echo "➔ Executing via host system Node.js / npm..."
    if [ "$COMMAND" = "install" ] || [ "$COMMAND" = "ci" ]; then
      npm "$COMMAND" "$@"
    else
      npm run "$COMMAND" "$@"
    fi
    ;;

  *)
    echo "❌ HATA: Sistemde Podman, Docker veya Node.js/npm bulunamadı!"
    echo "   Lütfen aşağıdakilerden birini kurun:"
    echo "   1) Podman: https://podman.io/"
    echo "   2) Docker: https://www.docker.com/"
    echo "   3) Node.js (v20+): https://nodejs.org/"
    exit 1
    ;;
esac

echo "✓ Tamamlandı!"
