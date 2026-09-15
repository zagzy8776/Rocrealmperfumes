#!/usr/bin/env bash
# Vercel build: generate the Prisma client, boot the API on the build machine so
# product pages can be prerendered with real data, then build the frontend.
set -e

cd "$(dirname "$0")/../server"
npx prisma generate

PORT=5001 RRP_FORCE_LISTEN=1 node src/index.js &
SERVER_PID=$!
cleanup() { kill "$SERVER_PID" 2>/dev/null || true; }
trap cleanup EXIT

for _ in $(seq 1 30); do
  curl -sf http://localhost:5001/api/health >/dev/null 2>&1 && break
  sleep 1
done

# Build-time-only API base for the prerenderer/sitemap. The browser bundle keeps
# the same-origin VITE_API_URL="/api" from client/.env.production.
export RRP_BUILD_API_URL=http://localhost:5001/api

cd ../client
npm run build