# Office of Workers Compensation — Official Website

The official public website and content management system for the **Office of Workers Compensation (OWC)**, Papua New Guinea. Built to provide workers, employers, and the public with clear information about compensation services, claims processes, events, and news.

## Overview

This is a full-stack Next.js application with a built-in admin CMS. Content managed through the admin panel — hero slides, news articles, events, services, FAQs, leadership, and office locations — is reflected live on the public-facing site.

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
- Services, news, events, FAQs, leadership, office locations
- Contact form with admin inbox
- Document/resource downloads
- Alert banner (toggle from admin)

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

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8+ (XAMPP or any MySQL server)

### Setup

1. Clone the repo and install dependencies:
```bash
npm install
```

2. Start MySQL and create the database:
```sql
CREATE DATABASE owc_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. (Optional) Create a `.env.local` file if your MySQL config differs from defaults:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=owc_db
ADMIN_INITIAL_PASSWORD=ChangeMe@OWC2026!
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
- **Password:** `ChangeMe@OWC2026!` (change after first login)

## Production

```bash
npm run build
npm start   # runs on port 8080
```

Ensure `JWT_SECRET` and `ADMIN_INITIAL_PASSWORD` are set as environment variables in production.
