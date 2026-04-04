import pool from './db'
import bcrypt from 'bcryptjs'
import { SEED_DOCUMENTS, SEED_SERVICES, SEED_NEWS, SEED_EVENTS } from './seedData'

let initialized = false

export async function initDb() {
  if (initialized) return
  initialized = true

  // Auto-create the database if it doesn't exist
  const mysql = await import('mysql2/promise')
  try {
    const tmp = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    })
    await tmp.execute('CREATE DATABASE IF NOT EXISTS njss_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci')
    await tmp.end()
  } catch {}

  const conn = await pool.getConnection()
  try {
    await conn.execute(`CREATE TABLE IF NOT EXISTS users (id INT PRIMARY KEY AUTO_INCREMENT, username VARCHAR(200) UNIQUE NOT NULL, password_hash VARCHAR(255) NOT NULL, role VARCHAR(50) NOT NULL DEFAULT 'admin', created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`)
    await conn.execute(`CREATE TABLE IF NOT EXISTS news_articles (id INT PRIMARY KEY AUTO_INCREMENT, slug VARCHAR(300) UNIQUE NOT NULL, date VARCHAR(50) NOT NULL, month VARCHAR(20) NOT NULL, year VARCHAR(10) NOT NULL, category VARCHAR(100) NOT NULL, title TEXT NOT NULL, excerpt TEXT NOT NULL, image TEXT, author VARCHAR(200) NOT NULL DEFAULT 'NJSS Communications', read_time VARCHAR(50) NOT NULL DEFAULT '3 min read', body LONGTEXT, published TINYINT NOT NULL DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`)
    await conn.execute("CREATE TABLE IF NOT EXISTS contact_messages (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(200) NOT NULL, email VARCHAR(200) NOT NULL, subject VARCHAR(300) NOT NULL, message TEXT NOT NULL, `read` TINYINT NOT NULL DEFAULT 0, received_at DATETIME DEFAULT CURRENT_TIMESTAMP)")
    await conn.execute(`CREATE TABLE IF NOT EXISTS pages (id INT PRIMARY KEY AUTO_INCREMENT, slug VARCHAR(200) UNIQUE NOT NULL, badge VARCHAR(200) NOT NULL DEFAULT '', title VARCHAR(300) NOT NULL, subtitle TEXT, hero_image TEXT, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`)
    await conn.execute(`CREATE TABLE IF NOT EXISTS menu_items (id INT PRIMARY KEY AUTO_INCREMENT, label VARCHAR(200) NOT NULL, href VARCHAR(500) NOT NULL, position INT NOT NULL DEFAULT 0)`)
    await conn.execute(`CREATE TABLE IF NOT EXISTS documents (id INT PRIMARY KEY AUTO_INCREMENT, title VARCHAR(300) NOT NULL, category VARCHAR(100) NOT NULL DEFAULT 'General', filename VARCHAR(300) NOT NULL, original_name VARCHAR(300) NOT NULL, file_size INT NOT NULL DEFAULT 0, uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP)`)
    await conn.execute(`CREATE TABLE IF NOT EXISTS audit_log (id INT PRIMARY KEY AUTO_INCREMENT, username VARCHAR(200) NOT NULL, action VARCHAR(200) NOT NULL, detail TEXT, ip VARCHAR(100), ts DATETIME DEFAULT CURRENT_TIMESTAMP)`)
    await conn.execute("CREATE TABLE IF NOT EXISTS site_settings (`key` VARCHAR(200) PRIMARY KEY, value TEXT NOT NULL)")
    await conn.execute(`CREATE TABLE IF NOT EXISTS events (id INT PRIMARY KEY AUTO_INCREMENT, title VARCHAR(300) NOT NULL, description TEXT, event_date VARCHAR(50) NOT NULL, event_time VARCHAR(50) NOT NULL DEFAULT '', location VARCHAR(300) NOT NULL DEFAULT '', category VARCHAR(100) NOT NULL DEFAULT 'General', image TEXT, published TINYINT NOT NULL DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`)
    await conn.execute(`CREATE TABLE IF NOT EXISTS offices (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(200) NOT NULL, address TEXT, phone VARCHAR(100) NOT NULL DEFAULT '', email VARCHAR(200) NOT NULL DEFAULT '', hours VARCHAR(200) NOT NULL DEFAULT 'Mon–Fri: 8:00 AM – 4:00 PM', position INT NOT NULL DEFAULT 0)`)
    await conn.execute(`CREATE TABLE IF NOT EXISTS leadership (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(200) NOT NULL, title VARCHAR(200) NOT NULL, since VARCHAR(50) NOT NULL DEFAULT '', photo TEXT, position INT NOT NULL DEFAULT 0)`)
    await conn.execute(`CREATE TABLE IF NOT EXISTS faqs (id INT PRIMARY KEY AUTO_INCREMENT, question TEXT NOT NULL, answer TEXT NOT NULL, position INT NOT NULL DEFAULT 0, published TINYINT NOT NULL DEFAULT 1)`)
    await conn.execute(`CREATE TABLE IF NOT EXISTS hero_slides (id INT PRIMARY KEY AUTO_INCREMENT, badge VARCHAR(200) NOT NULL DEFAULT '', title TEXT NOT NULL, subtitle TEXT, image TEXT, cta_label VARCHAR(200) NOT NULL DEFAULT 'Learn More', cta_href VARCHAR(500) NOT NULL DEFAULT '/', cta_external TINYINT NOT NULL DEFAULT 0, secondary_label VARCHAR(200) NOT NULL DEFAULT '', secondary_href VARCHAR(500) NOT NULL DEFAULT '/', position INT NOT NULL DEFAULT 0, published TINYINT NOT NULL DEFAULT 1)`)
    await conn.execute(`CREATE TABLE IF NOT EXISTS services (id INT PRIMARY KEY AUTO_INCREMENT, position INT NOT NULL DEFAULT 0, tag VARCHAR(100) NOT NULL DEFAULT '', icon_name VARCHAR(100) NOT NULL DEFAULT 'HelpCircle', title VARCHAR(300) NOT NULL, description TEXT, who_eligible TEXT, benefits LONGTEXT, published TINYINT NOT NULL DEFAULT 1)`)

    // Seed pages
    const defaultPages = [
      { slug: 'about',     badge: 'About Us',       title: 'About the National Judicial Staff Service',  subtitle: 'The National Judicial Staff Service (NJSS) provides efficient and effective administrative support to the Supreme Court and National Court of Papua New Guinea.', hero_image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1920&q=80' },
      { slug: 'services',  badge: 'Our Services',   title: 'Courts & Judicial Services',                 subtitle: 'Comprehensive court and registry services supporting access to justice for all people of Papua New Guinea.', hero_image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80' },
      { slug: 'news',      badge: 'News & Updates', title: 'News & Announcements',                       subtitle: 'Stay informed with the latest updates, judicial notices, and announcements from the NJSS and PNG Judiciary.', hero_image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&q=80' },
      { slug: 'events',    badge: 'Events',         title: 'Events & Programs',                          subtitle: 'Judicial outreach programs, training sessions, law week activities, and community legal awareness events across Papua New Guinea.', hero_image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80' },
      { slug: 'resources', badge: 'Resources',      title: 'Resources & Court Forms',                    subtitle: 'Download official court forms, practice directions, procedural guides, and judicial policy documents.', hero_image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1920&q=80' },
      { slug: 'contact',   badge: 'Contact Us',     title: 'Contact the NJSS',                           subtitle: 'Our registry officers and staff are available Monday to Friday, 8:00 AM to 4:00 PM to assist you.', hero_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80' },
    ]
    for (const p of defaultPages) {
      await conn.execute('INSERT IGNORE INTO pages (slug, badge, title, subtitle, hero_image) VALUES (?, ?, ?, ?, ?)', [p.slug, p.badge, p.title, p.subtitle, p.hero_image])
    }

    // Seed admin user
    const [rows] = await conn.execute('SELECT id FROM users WHERE username = ?', ['admin']) as any[]
    if ((rows as any[]).length === 0) {
      const initialPass = process.env.ADMIN_INITIAL_PASSWORD || 'ChangeMe@NJSS2026!'
      const hash = await bcrypt.hash(initialPass, 12)
      await conn.execute('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', ['admin', hash, 'superadmin'])
    }

    // Seed default settings
    const defaultSettings: Record<string, string> = {
      site_name: 'National Judicial Staff Service',
      site_tagline: 'Serving Justice for All People of Papua New Guinea',
      contact_phone: '+675 325 7902',
      contact_email: 'info@judiciary.gov.pg',
      contact_address: 'Waigani Court Complex\nWaigani Drive, Waigani\nNational Capital District, Papua New Guinea',
      contact_hours: 'Mon–Fri, 8:00 AM – 4:00 PM',
      banner_enabled: 'true',
      banner_text: 'Court registry enquiries: +675 325 7902 | Email: info@judiciary.gov.pg | Waigani Court Complex, NCD',
      banner_link: '/contact',
      home_show_stats: 'true',
      home_show_services: 'true',
      home_show_process: 'true',
      home_show_news: 'true',
      home_show_events: 'true',
      home_show_cta: 'true',
      stat_cases: '12,400+',
      stat_benefits: '3,200+',
      stat_processing: '22',
      stat_coverage: '120+',
    }
    for (const [k, v] of Object.entries(defaultSettings)) {
      await conn.execute(
        'INSERT INTO site_settings (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)',
        [k, v]
      )
    }

    // Seed Documents
    for (const d of SEED_DOCUMENTS) {
      const [docExists] = await conn.execute('SELECT id FROM documents WHERE title = ? LIMIT 1', [d.title]) as any[]
      if ((docExists as any[]).length === 0) {
        await conn.execute(
          'INSERT INTO documents (title, category, filename, original_name, file_size) VALUES (?, ?, ?, ?, ?)',
          [d.title, d.category, d.filename, d.original_name, d.file_size]
        )
      }
    }

    // Remove duplicate services (keep lowest id per title)
    await conn.execute(`
      DELETE s1 FROM services s1
      INNER JOIN services s2 ON s1.title = s2.title AND s1.id > s2.id
    `)

    // Seed Services
    for (const s of SEED_SERVICES) {
      const [exists] = await conn.execute('SELECT id FROM services WHERE title = ? LIMIT 1', [s.title]) as any[]
      if ((exists as any[]).length === 0) {
        await conn.execute(
          'INSERT INTO services (position, tag, icon_name, title, description, who_eligible, benefits, published) VALUES (?, ?, ?, ?, ?, ?, ?, 1)',
          [s.position, s.tag, s.icon_name, s.title, s.description, s.who_eligible, JSON.stringify(s.benefits)]
        )
      }
    }

    // Seed News Articles
    for (const a of SEED_NEWS) {
      await conn.execute(
        'INSERT IGNORE INTO news_articles (slug, date, month, year, category, title, excerpt, image, author, read_time, body, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)',
        [a.slug, a.date, a.month, a.year, a.category, a.title, a.excerpt, a.image, a.author, a.read_time, JSON.stringify(a.body)]
      )
    }

    // Seed Events
    for (const e of SEED_EVENTS) {
      const [eExists] = await conn.execute('SELECT id FROM events WHERE title = ? LIMIT 1', [e.title]) as any[]
      if ((eExists as any[]).length === 0) {
        await conn.execute(
          'INSERT INTO events (title, description, event_date, event_time, location, category, image, published) VALUES (?, ?, ?, ?, ?, ?, ?, 1)',
          [e.title, e.description, e.event_date, e.event_time, e.location, e.category, e.image]
        )
      }
    }

    console.log('Database ready: MySQL njss_db')
  } finally {
    conn.release()
  }
}
