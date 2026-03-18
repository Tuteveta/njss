# Office of Workers Compensation — Papua New Guinea

> **OWC** is the official enterprise web platform for the Office of Workers Compensation, an agency of the Independent State of Papua New Guinea, established under the **Workers Compensation Act 1978**. The platform provides public-facing information services, a content management system, and digital tools for workers, employers, and administrators.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start (Development)](#quick-start-development)
- [Environment Variables](#environment-variables)
- [Database Setup (MySQL / XAMPP)](#database-setup-mysql--xampp)
- [Admin Panel](#admin-panel)
- [Building for Production](#building-for-production)
- [Deployment Guide](#deployment-guide)
- [API Reference](#api-reference)
- [Pages & Routes](#pages--routes)

---

## Overview

The OWC platform consists of two applications:

| App | Technology | Port |
|-----|-----------|------|
| **Frontend** | React 19 + Vite + TypeScript + Tailwind CSS | `5173` (dev) |
| **Backend** | Go + Gin + MySQL | `8080` |

**Key features:**
- Public website: Home, About, Services, Claims, News, Events, Resources, Contact
- Full CMS admin panel for managing all content
- JWT-authenticated admin API
- Media library with file uploads
- Contact form with email notifications
- News articles with rich-text body editor
- Leadership & office management
- Hero slide manager
- Site-wide settings panel
- Audit logging
- MySQL database (XAMPP compatible)

---

## Tech Stack

### Frontend
| Library | Version | Purpose |
|---------|---------|---------|
| React | 19 | UI framework |
| Vite | 6 | Build tool & dev server |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 3 | Utility-first styling |
| shadcn/ui | manual | Component library |
| Lucide React | latest | Icons |
| React Router DOM | 7 | Client-side routing |

### Backend
| Library | Purpose |
|---------|---------|
| Go 1.25 | Runtime |
| Gin | HTTP framework |
| go-sql-driver/mysql | MySQL driver |
| golang-jwt/jwt | JWT authentication |
| bcrypt | Password hashing |
| uuid | File naming |
| gin-contrib/cors | CORS middleware |

---

## Project Structure

```
owc-png/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         # Navbar, Footer
│   │   │   ├── admin/          # AdminLayout sidebar
│   │   │   └── ui/             # shadcn/ui primitives
│   │   ├── context/
│   │   │   └── SettingsContext.tsx
│   │   ├── lib/
│   │   │   └── adminApi.ts     # Authenticated API client
│   │   └── pages/
│   │       ├── admin/          # All CMS pages
│   │       ├── Home.tsx
│   │       ├── About.tsx
│   │       ├── Services.tsx
│   │       ├── Claims.tsx
│   │       ├── News.tsx
│   │       ├── NewsArticle.tsx
│   │       ├── Events.tsx
│   │       ├── Resources.tsx
│   │       └── Contact.tsx
│   ├── public/
│   │   └── png-coa.png         # PNG Coat of Arms logo
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── backend/
│   ├── main.go                 # All routes, handlers, DB logic
│   ├── go.mod
│   ├── go.sum
│   └── uploads/
│       ├── images/             # Uploaded images
│       └── documents/          # Uploaded PDFs/documents
│
└── README.md
```

---

## Prerequisites

| Tool | Minimum Version | Download |
|------|----------------|---------|
| Node.js | 20 LTS | https://nodejs.org |
| Go | 1.21 | https://go.dev/dl |
| XAMPP (MySQL) | 8.x | https://www.apachefriends.org |
| Git | 2.x | https://git-scm.com |

---

## Quick Start (Development)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd owc-png
```

### 2. Start MySQL via XAMPP

1. Open **XAMPP Control Panel**
2. Click **Start** next to **MySQL**
3. MySQL will run on `localhost:3306`

> The database `owc_db` is created automatically on first backend start.

### 3. Start the backend

```bash
cd backend
go run main.go
```

Backend runs at: **http://localhost:8080**

On first run it will:
- Create the `owc_db` database
- Create all tables
- Seed the admin user (`admin` / `ChangeMe@OWC2026!`)
- Seed default content (pages, settings, demo news, etc.)

### 4. Start the frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

The Vite dev server proxies all `/api/*` requests to `http://localhost:8080`.

---

## Environment Variables

### Backend

Set these before running (optional — all have safe defaults):

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_DSN` | `root:@tcp(127.0.0.1:3306)/owc_db?parseTime=true` | MySQL connection string |
| `ADMIN_INITIAL_PASSWORD` | `ChangeMe@OWC2026!` | Password for the seeded admin user |
| `JWT_SECRET` | internal default | Secret for signing JWT tokens |
| `SMTP_HOST` | — | SMTP server for email notifications |
| `SMTP_PORT` | `587` | SMTP port |
| `SMTP_USER` | — | SMTP username |
| `SMTP_PASS` | — | SMTP password |

**Example (Windows PowerShell):**
```powershell
$env:DB_DSN = "owcuser:MyPassword@tcp(127.0.0.1:3306)/owc_db?parseTime=true"
$env:ADMIN_INITIAL_PASSWORD = "SecurePassword123!"
.\owc-backend.exe
```

**Example (Linux/macOS):**
```bash
export DB_DSN="owcuser:MyPassword@tcp(127.0.0.1:3306)/owc_db?parseTime=true"
export ADMIN_INITIAL_PASSWORD="SecurePassword123!"
./owc-backend
```

---

## Database Setup (MySQL / XAMPP)

The backend auto-creates everything on first start. If you prefer to set up manually:

```sql
-- Run in phpMyAdmin or MySQL CLI
CREATE DATABASE IF NOT EXISTS owc_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER 'owcuser'@'localhost' IDENTIFIED BY 'YourPassword';
GRANT ALL PRIVILEGES ON owc_db.* TO 'owcuser'@'localhost';
FLUSH PRIVILEGES;
```

Then set `DB_DSN=owcuser:YourPassword@tcp(127.0.0.1:3306)/owc_db?parseTime=true`.

---

## Admin Panel

The admin CMS is available at: **http://localhost:5173/admin**

**Default credentials:**
```
Username: admin
Password: ChangeMe@OWC2026!
```

> **Change the password immediately** after first login via **Site Settings → Change Password**.

### Admin Sections

| Section | URL | Description |
|---------|-----|-------------|
| Dashboard | `/admin` | Stats overview |
| Hero Slides | `/admin/hero-slides` | Homepage carousel |
| News Articles | `/admin/news` | Create & publish articles |
| Events | `/admin/events` | Upcoming events |
| Services | `/admin/services` | Service listings |
| FAQs | `/admin/faqs` | Public FAQ list |
| Leadership | `/admin/leadership` | Team members + photos |
| Offices | `/admin/offices` | Regional office info |
| About Content | `/admin/about` | Mission, vision, values, etc. |
| Pages | `/admin/pages` | Hero images & subtitles per page |
| Media Library | `/admin/media` | Upload & manage images |
| Documents | `/admin/documents` | Upload PDFs & forms |
| Menus | `/admin/menus` | Navigation links |
| Site Settings | `/admin/settings` | Contact info, SMTP, branding |
| Audit Log | `/admin/audit-log` | Action history |

---

## Building for Production

### 1. Build the frontend

```bash
cd frontend
npm run build
```

Output is in `frontend/dist/`.

### 2. Build the backend binary

```bash
cd backend
go build -o owc-backend.exe .       # Windows
go build -o owc-backend .           # Linux/macOS
```

### 3. Production file layout

```
deploy/
├── owc-backend.exe    # Go binary
├── dist/              # Copy of frontend/dist (served as static files)
└── uploads/           # Persisted user uploads
```

> Serve `dist/` as static files from the Go binary (embed or serve from disk).

---

## Deployment Guide

### Option A — Windows Server (XAMPP)

1. Install **XAMPP** and start **MySQL**
2. Create the `owc_db` database in phpMyAdmin
3. Copy `owc-backend.exe` and the `uploads/` folder to `C:\OWC\`
4. Set environment variables in a `.env` file or system properties
5. Run the backend:
   ```powershell
   cd C:\OWC
   .\owc-backend.exe
   ```
6. Serve the frontend `dist/` folder via **Apache** (bundled in XAMPP):
   - Copy `frontend/dist/` to `C:\xampp\htdocs\owc\`
   - Or configure a VirtualHost in Apache pointing to your dist folder
7. Access the site at `http://localhost` or your server IP

**Running as a Windows Service (auto-start):**
```powershell
# Using NSSM (Non-Sucking Service Manager)
nssm install OWC "C:\OWC\owc-backend.exe"
nssm set OWC AppDirectory "C:\OWC"
nssm start OWC
```

---

### Option B — Linux VPS (Ubuntu/Debian)

```bash
# 1. Install dependencies
sudo apt update && sudo apt install -y mysql-server nginx

# 2. Create DB
sudo mysql -e "CREATE DATABASE owc_db CHARACTER SET utf8mb4;"
sudo mysql -e "CREATE USER 'owcuser'@'localhost' IDENTIFIED BY 'password';"
sudo mysql -e "GRANT ALL ON owc_db.* TO 'owcuser'@'localhost';"

# 3. Copy binary and uploads
sudo mkdir -p /opt/owc
sudo cp owc-backend /opt/owc/
sudo cp -r uploads /opt/owc/

# 4. Create systemd service
sudo tee /etc/systemd/system/owc.service > /dev/null <<EOF
[Unit]
Description=OWC Backend
After=network.target mysql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/owc
Environment=DB_DSN=owcuser:password@tcp(127.0.0.1:3306)/owc_db?parseTime=true
ExecStart=/opt/owc/owc-backend
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable owc
sudo systemctl start owc

# 5. Configure Nginx to reverse proxy API and serve frontend
sudo tee /etc/nginx/sites-available/owc > /dev/null <<EOF
server {
    listen 80;
    server_name owc.gov.pg www.owc.gov.pg;

    root /var/www/owc;
    index index.html;

    # Serve frontend SPA
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Proxy API to Go backend
    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    # Serve uploaded files
    location /uploads/ {
        alias /opt/owc/uploads/;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/owc /etc/nginx/sites-enabled/
sudo cp -r frontend/dist/* /var/www/owc/
sudo nginx -t && sudo systemctl reload nginx
```

---

### Option C — Docker (Recommended for Cloud)

```dockerfile
# backend/Dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o owc-backend .

FROM alpine:latest
RUN apk add --no-cache ca-certificates
WORKDIR /app
COPY --from=builder /app/owc-backend .
EXPOSE 8080
CMD ["./owc-backend"]
```

```yaml
# docker-compose.yml
version: "3.9"
services:
  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: rootpass
      MYSQL_DATABASE: owc_db
      MYSQL_USER: owcuser
      MYSQL_PASSWORD: owcpass
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      DB_DSN: owcuser:owcpass@tcp(mysql:3306)/owc_db?parseTime=true
    volumes:
      - ./uploads:/app/uploads
    depends_on:
      - mysql

volumes:
  mysql_data:
```

```bash
docker-compose up -d
```

---

## API Reference

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/hero-slides` | Published hero slides |
| GET | `/api/services` | Published services |
| GET | `/api/news` | News articles (supports `?q=search&category=X`) |
| GET | `/api/news/:slug` | Single article |
| GET | `/api/events` | Upcoming events |
| GET | `/api/offices` | Regional offices |
| GET | `/api/leadership` | Leadership team |
| GET | `/api/faqs` | Published FAQs |
| GET | `/api/documents` | Downloadable documents |
| GET | `/api/menus` | Navigation items |
| GET | `/api/pages` | Page hero data |
| GET | `/api/about` | About page content |
| GET | `/api/settings` | Site-wide settings |
| POST | `/api/contact` | Submit contact message |

### Admin Endpoints (JWT required)

All admin endpoints require `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Authenticate, returns JWT |
| POST | `/api/admin/logout` | Invalidate session |
| GET/PUT | `/api/admin/settings` | Site settings CRUD |
| GET/POST/PUT/DELETE | `/api/admin/news` | News management |
| GET/POST/PUT/DELETE | `/api/admin/leadership` | Leadership management |
| GET/POST/PUT/DELETE | `/api/admin/offices` | Offices management |
| GET/POST/PUT/DELETE | `/api/admin/faqs` | FAQ management |
| GET/POST/PUT/DELETE | `/api/admin/hero-slides` | Hero slides management |
| GET/POST/PUT/DELETE | `/api/admin/services` | Services management |
| GET/POST/PUT/DELETE | `/api/admin/events` | Events management |
| GET/POST | `/api/admin/media` | Image upload & list |
| GET/POST/DELETE | `/api/admin/documents` | Document upload & list |
| GET | `/api/admin/messages` | Contact messages |
| GET | `/api/admin/audit-log` | System audit log |

---

## Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero carousel, stats, services, news, events, CTA |
| `/about` | About | Mission, vision, mandate, leadership, legislation |
| `/services` | Services | Full service catalogue with benefit lists |
| `/claims` | Claims | Eligibility, process, online claim form, tracker |
| `/news` | News | Article listing with search & category filter |
| `/news/:slug` | Article | Full article with rich-text body |
| `/events` | Events | Upcoming & past events |
| `/resources` | Resources | Downloads, guides, FAQ accordion |
| `/contact` | Contact | Contact form + office map cards |
| `/admin` | Dashboard | CMS entry point (requires auth) |

---

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `hsl(210, 70%, 22%)` | Navy blue — headings, nav, buttons |
| Accent | `hsl(152, 60%, 40%)` | Emerald — CTAs, highlights |
| Background | `#ffffff` / `#f9fafb` | Page backgrounds |
| Text | `#111827` / `#6b7280` | Body text |
| Font | Inter (Google Fonts) | All text |

---

## License

© Office of Workers Compensation, Papua New Guinea. All rights reserved.
