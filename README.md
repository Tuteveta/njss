# Office of Workers Compensation — Official Website

The official public website and content management system for the **Office of Workers Compensation (OWC)**, Papua New Guinea. Built to provide workers, employers, and the public with clear information about compensation services, claims processes, events, and news.

## Project

The application lives in [`owc-next/`](./owc-next/) — a full-stack Next.js app with a built-in admin CMS. Content managed through the admin panel (hero slides, news, events, services, FAQs, leadership, offices) is reflected live on the public site.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | MySQL (via `mysql2`) |
| Auth | JWT + bcrypt |
| Icons | Lucide React |
| Runtime | Node.js |

## Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8+ (XAMPP or any MySQL server)

### Setup

```bash
cd owc-next
npm install
npm run dev
```

The app auto-creates all tables and seeds the default admin user on first run against a running MySQL instance.

**Default admin credentials**
- URL: `http://localhost:3000/admin`
- Username: `admin`
- Password: `ChangeMe@OWC2026!`

### Environment Variables (optional)

Create `owc-next/.env.local` to override defaults:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=owc_db
ADMIN_INITIAL_PASSWORD=ChangeMe@OWC2026!
JWT_SECRET=your-secret-key
```

## Features

**Public Site**
- Hero carousel, services, news, events, FAQs, offices, leadership
- Contact form with admin inbox
- Document/resource downloads
- Alert banner (toggle from admin)

**Admin CMS** (`/admin`)
- News article editor with multi-section body builder
- Event, service, FAQ, leadership, office management
- Media library (image upload) and document manager (PDF)
- Hero slide and navigation menu management
- Site settings, audit log, contact inbox, password change

## Deployment

CI/CD is configured in [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) — pushes to `master` automatically build and deploy via PM2 on the EC2 server.

```bash
cd owc-next
npm run build
npm start   # runs on port 8080
```
