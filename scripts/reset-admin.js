/**
 * Run with: node scripts/reset-admin.js
 * Resets the admin user password (or creates the user if missing).
 */
const bcrypt = require('bcryptjs')
const mysql = require('mysql2/promise')

const USERNAME = 'admin'
const NEW_PASSWORD = 'Admin@NJSS2026!'

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'njss_db',
  })

  const hash = await bcrypt.hash(NEW_PASSWORD, 12)

  const [rows] = await conn.execute('SELECT id FROM users WHERE username = ?', [USERNAME])

  if (rows.length > 0) {
    await conn.execute('UPDATE users SET password_hash = ?, role = ? WHERE username = ?', [hash, 'superadmin', USERNAME])
    console.log(`✓ Password reset for user "${USERNAME}"`)
  } else {
    await conn.execute('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', [USERNAME, hash, 'superadmin'])
    console.log(`✓ Created user "${USERNAME}"`)
  }

  console.log(`  Username : ${USERNAME}`)
  console.log(`  Password : ${NEW_PASSWORD}`)
  await conn.end()
}

main().catch(err => { console.error('Error:', err.message); process.exit(1) })
