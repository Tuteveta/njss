#!/bin/bash
# NJSS — EC2 first-time server setup
# Run once on a fresh Ubuntu 24.04 instance as the ubuntu user.
# Usage: bash server-setup.sh

set -e

echo "==> Updating system..."
sudo apt update && sudo apt upgrade -y

echo "==> Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

echo "==> Installing nginx, git & MySQL..."
sudo apt install -y nginx git mysql-server

echo "==> Securing MySQL and creating database..."
sudo mysql <<'SQL'
CREATE DATABASE IF NOT EXISTS njss_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'njss_user'@'localhost' IDENTIFIED BY 'CHANGE_ME_STRONG_DB_PASSWORD';
GRANT ALL PRIVILEGES ON njss_db.* TO 'njss_user'@'localhost';
FLUSH PRIVILEGES;
SQL
echo "    MySQL ready. DB: njss_db, User: njss_user"
echo "    !! Change the DB password above before running this script !!"

echo "==> Installing PM2..."
sudo npm install -g pm2

echo "==> Cloning repo..."
sudo mkdir -p /var/www/njss
sudo chown ubuntu:ubuntu /var/www/njss
git clone https://github.com/Tuteveta/njss.git /var/www/njss

echo ""
echo "==> Repo cloned. Now create your environment file:"
echo "    nano /var/www/njss/.env.local"
echo ""
echo "    Paste and fill in:"
echo "    DB_HOST=127.0.0.1"
echo "    DB_PORT=3306"
echo "    DB_USER=njss_user"
echo "    DB_PASSWORD=CHANGE_ME_STRONG_DB_PASSWORD"
echo "    DB_NAME=njss_db"
echo "    JWT_SECRET=<64-random-chars>"
echo "    NODE_ENV=production"
echo ""
echo "    Generate JWT_SECRET with:"
echo "    node -e \"console.log(require('crypto').randomBytes(48).toString('hex'))\""
echo ""
read -p "Press ENTER once .env.local is saved to continue..."

echo "==> Installing dependencies & building..."
cd /var/www/njss
npm ci --omit=dev
npm run build

echo "==> Starting app with PM2..."
pm2 start ecosystem.config.js --env production
pm2 save

echo "==> Configuring PM2 to start on reboot..."
pm2 startup | tail -1 | sudo bash

echo "==> Configuring nginx..."
sudo tee /etc/nginx/sites-available/njss > /dev/null <<'NGINX'
server {
    listen 80;
    server_name _;

    client_max_body_size 20M;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX

sudo ln -sf /etc/nginx/sites-available/njss /etc/nginx/sites-enabled/njss
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

echo ""
echo "======================================"
echo " NJSS is live!"
echo " Visit: http://$(curl -s ifconfig.me)"
echo " Admin: http://$(curl -s ifconfig.me)/admin"
echo "======================================"
echo ""
echo "Next: point your domain to this IP, then run:"
echo "  sudo apt install -y certbot python3-certbot-nginx"
echo "  sudo certbot --nginx -d your-domain.com"
