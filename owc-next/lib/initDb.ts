import pool from './db'
import bcrypt from 'bcryptjs'

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
    await tmp.execute('CREATE DATABASE IF NOT EXISTS owc_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci')
    await tmp.end()
  } catch {}

  const conn = await pool.getConnection()
  try {
    await conn.execute(`CREATE TABLE IF NOT EXISTS users (id INT PRIMARY KEY AUTO_INCREMENT, username VARCHAR(200) UNIQUE NOT NULL, password_hash VARCHAR(255) NOT NULL, role VARCHAR(50) NOT NULL DEFAULT 'admin', created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`)
    await conn.execute(`CREATE TABLE IF NOT EXISTS news_articles (id INT PRIMARY KEY AUTO_INCREMENT, slug VARCHAR(300) UNIQUE NOT NULL, date VARCHAR(50) NOT NULL, month VARCHAR(20) NOT NULL, year VARCHAR(10) NOT NULL, category VARCHAR(100) NOT NULL, title TEXT NOT NULL, excerpt TEXT NOT NULL, image TEXT NOT NULL DEFAULT '', author VARCHAR(200) NOT NULL DEFAULT 'OWC Communications', read_time VARCHAR(50) NOT NULL DEFAULT '3 min read', body LONGTEXT NOT NULL DEFAULT '[]', published TINYINT NOT NULL DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`)
    await conn.execute("CREATE TABLE IF NOT EXISTS contact_messages (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(200) NOT NULL, email VARCHAR(200) NOT NULL, subject VARCHAR(300) NOT NULL, message TEXT NOT NULL, `read` TINYINT NOT NULL DEFAULT 0, received_at DATETIME DEFAULT CURRENT_TIMESTAMP)")
    await conn.execute(`CREATE TABLE IF NOT EXISTS pages (id INT PRIMARY KEY AUTO_INCREMENT, slug VARCHAR(200) UNIQUE NOT NULL, badge VARCHAR(200) NOT NULL DEFAULT '', title VARCHAR(300) NOT NULL, subtitle TEXT NOT NULL DEFAULT '', hero_image TEXT NOT NULL DEFAULT '', updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`)
    await conn.execute(`CREATE TABLE IF NOT EXISTS menu_items (id INT PRIMARY KEY AUTO_INCREMENT, label VARCHAR(200) NOT NULL, href VARCHAR(500) NOT NULL, position INT NOT NULL DEFAULT 0)`)
    await conn.execute(`CREATE TABLE IF NOT EXISTS documents (id INT PRIMARY KEY AUTO_INCREMENT, title VARCHAR(300) NOT NULL, category VARCHAR(100) NOT NULL DEFAULT 'General', filename VARCHAR(300) NOT NULL, original_name VARCHAR(300) NOT NULL, file_size INT NOT NULL DEFAULT 0, uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP)`)
    await conn.execute(`CREATE TABLE IF NOT EXISTS audit_log (id INT PRIMARY KEY AUTO_INCREMENT, username VARCHAR(200) NOT NULL, action VARCHAR(200) NOT NULL, detail TEXT, ip VARCHAR(100), ts DATETIME DEFAULT CURRENT_TIMESTAMP)`)
    await conn.execute("CREATE TABLE IF NOT EXISTS site_settings (`key` VARCHAR(200) PRIMARY KEY, value TEXT NOT NULL DEFAULT '')")
    await conn.execute(`CREATE TABLE IF NOT EXISTS events (id INT PRIMARY KEY AUTO_INCREMENT, title VARCHAR(300) NOT NULL, description TEXT NOT NULL DEFAULT '', event_date VARCHAR(50) NOT NULL, event_time VARCHAR(50) NOT NULL DEFAULT '', location VARCHAR(300) NOT NULL DEFAULT '', category VARCHAR(100) NOT NULL DEFAULT 'General', image TEXT NOT NULL DEFAULT '', published TINYINT NOT NULL DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`)
    await conn.execute(`CREATE TABLE IF NOT EXISTS offices (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(200) NOT NULL, address TEXT NOT NULL DEFAULT '', phone VARCHAR(100) NOT NULL DEFAULT '', email VARCHAR(200) NOT NULL DEFAULT '', hours VARCHAR(200) NOT NULL DEFAULT 'Mon–Fri: 8:00 AM – 4:00 PM', position INT NOT NULL DEFAULT 0)`)
    await conn.execute(`CREATE TABLE IF NOT EXISTS leadership (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(200) NOT NULL, title VARCHAR(200) NOT NULL, since VARCHAR(50) NOT NULL DEFAULT '', photo TEXT NOT NULL DEFAULT '', position INT NOT NULL DEFAULT 0)`)
    await conn.execute(`CREATE TABLE IF NOT EXISTS faqs (id INT PRIMARY KEY AUTO_INCREMENT, question TEXT NOT NULL, answer TEXT NOT NULL, position INT NOT NULL DEFAULT 0, published TINYINT NOT NULL DEFAULT 1)`)
    await conn.execute(`CREATE TABLE IF NOT EXISTS hero_slides (id INT PRIMARY KEY AUTO_INCREMENT, badge VARCHAR(200) NOT NULL DEFAULT '', title TEXT NOT NULL, subtitle TEXT NOT NULL DEFAULT '', image TEXT NOT NULL DEFAULT '', cta_label VARCHAR(200) NOT NULL DEFAULT 'Learn More', cta_href VARCHAR(500) NOT NULL DEFAULT '/', cta_external TINYINT NOT NULL DEFAULT 0, secondary_label VARCHAR(200) NOT NULL DEFAULT '', secondary_href VARCHAR(500) NOT NULL DEFAULT '/', position INT NOT NULL DEFAULT 0, published TINYINT NOT NULL DEFAULT 1)`)
    await conn.execute(`CREATE TABLE IF NOT EXISTS services (id INT PRIMARY KEY AUTO_INCREMENT, position INT NOT NULL DEFAULT 0, tag VARCHAR(100) NOT NULL DEFAULT '', icon_name VARCHAR(100) NOT NULL DEFAULT 'HelpCircle', title VARCHAR(300) NOT NULL, description TEXT NOT NULL DEFAULT '', who_eligible TEXT NOT NULL DEFAULT '', benefits LONGTEXT NOT NULL DEFAULT '[]', published TINYINT NOT NULL DEFAULT 1)`)

    // Seed admin user
    const [rows] = await conn.execute('SELECT id FROM users WHERE username = ?', ['admin']) as any[]
    if ((rows as any[]).length === 0) {
      const initialPass = process.env.ADMIN_INITIAL_PASSWORD || 'ChangeMe@OWC2026!'
      const hash = await bcrypt.hash(initialPass, 12)
      await conn.execute('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', ['admin', hash, 'superadmin'])
    }

    // Seed default settings
    const defaultSettings: Record<string, string> = {
      site_name: 'Office of Workers Compensation',
      site_tagline: "Protecting Papua New Guinea's Workforce",
      contact_phone: '(+675) 313 5000 / Toll-Free: 180 1100',
      contact_email: 'workerscomp@owc.gov.pg',
      contact_address: 'Gaukara Rumana, Wards Rd\nPort Moresby, NCD\nPapua New Guinea',
      contact_hours: 'Mon–Fri, 8:00 AM – 4:00 PM',
      banner_enabled: 'true',
      banner_text: 'For claims assistance call (+675) 313 5000 or Toll-Free 180 1100. Email: workerscomp@owc.gov.pg',
      banner_link: '/claims',
      home_show_stats: 'true',
      home_show_services: 'true',
      home_show_process: 'true',
      home_show_news: 'true',
      home_show_events: 'true',
      home_show_cta: 'true',
      stat_claims: '1,732',
      stat_benefits: 'K3.2M+',
      stat_processing: '60–90',
      stat_coverage: 'All PLOs',
    }
    for (const [k, v] of Object.entries(defaultSettings)) {
      await conn.execute('INSERT IGNORE INTO site_settings (`key`, value) VALUES (?, ?)', [k, v])
    }

    console.log('Database ready: MySQL owc_db')
  } finally {
    conn.release()
  }
}
