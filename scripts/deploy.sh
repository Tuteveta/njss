#!/bin/bash
# NJSS — EC2 deploy script
# Run this on the server after first-time setup, or to deploy updates.
# Usage: bash scripts/deploy.sh

set -e

APP_DIR="/var/www/njss"

echo "==> Pulling latest code..."
cd "$APP_DIR"
git pull origin master

echo "==> Installing dependencies..."
npm ci --omit=dev

echo "==> Building..."
npm run build

echo "==> Restarting app..."
pm2 restart njss || pm2 start ecosystem.config.js --env production

echo "==> Done. App is running."
pm2 status njss
