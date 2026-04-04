# National Judicial Staff Service — Official Website

The official public website and content management system for the **National Judicial Staff Service (NJSS)**, Papua New Guinea. Built to provide the public, legal practitioners, and stakeholders with information about the Supreme Court, National Court, court listings, registry services, and judicial resources.

## Overview

Full-stack Next.js application with a built-in admin CMS. Content managed through the admin panel — hero slides, news articles, events, services, FAQs, leadership, office locations — is reflected live on the public-facing site.

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

## Features

**Public Site**
- Hero carousel (DB-driven, with fallback content)
- Supreme Court & National Court pages with dropdowns
- Daily Court Diary, Listings, Acts & Rules, Summary Determinations
- News, events, FAQs, leadership, office locations
- Contact form with admin inbox
- Document/resource downloads (court forms, guides, legislation, reports)
- Alert banner (toggle from admin)
- Back-to-top button, skip-to-content (WCAG)

**Admin CMS** (`/admin`)
- News article editor with multi-section body builder
- Event management with image picker
- Hero slide manager with drag-to-reorder
- Services, FAQs, leadership, offices, pages — all CRUD
- Media library (image upload, copy URL, delete)
- Document manager (PDF upload by category)
- Navigation menu editor
- Site settings (name, contact info, stats, banner, theme)
- Audit log and contact message inbox
- Password change

**Security**
- HTTP security headers (CSP, HSTS, X-Frame-Options, etc.)
- Rate limiting on login (5 attempts → 30-min lockout)
- Input sanitisation on all API boundaries
- JWT + bcrypt authentication

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8+ (XAMPP or any MySQL server)

### Setup

1. Clone the repo and install dependencies:
```bash
npm install
```

2. Start MySQL. The database is auto-created on first run (`njss_db`).

3. (Optional) Create a `.env.local` file if your MySQL config differs from defaults:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=njss_db
ADMIN_INITIAL_PASSWORD=ChangeMe@NJSS2026!
JWT_SECRET=your-secret-key
```

4. Run the development server:
```bash
npm run dev
```

The app auto-creates all tables and seeds the default admin user and site settings on first run.

5. Open [http://localhost:3000](http://localhost:3000) for the public site.
   Open [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

### Default Admin Credentials
- **Username:** `admin`
- **Password:** `ChangeMe@NJSS2026!` (change immediately after first login)

## Production

```bash
npm run build
npm start   # runs on port 8080
```

Ensure `JWT_SECRET` and `ADMIN_INITIAL_PASSWORD` are set as environment variables in production.
