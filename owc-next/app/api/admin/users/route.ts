import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import bcrypt from 'bcryptjs'
import { requireAuth } from '@/lib/auth'
import { isSuperAdmin, ROLES } from '@/lib/roles'
import { validatePassword, validateUsername } from '@/lib/validate'
import { sanitiseString } from '@/lib/sanitise'
import { auditLog } from '@/lib/audit'
import { getClientIp } from '@/lib/rateLimit'

export async function GET(req: NextRequest) {
  const auth = requireAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isSuperAdmin(auth.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const [rows] = await pool.execute(
    'SELECT id, username, role, created_at FROM users ORDER BY id ASC'
  ) as any[]
  return NextResponse.json({ users: rows })
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isSuperAdmin(auth.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { username, password, role } = await req.json()

  const usernameError = validateUsername(username)
  if (usernameError) return NextResponse.json({ error: usernameError }, { status: 400 })

  const passError = validatePassword(password)
  if (passError) return NextResponse.json({ error: passError }, { status: 400 })

  if (!(ROLES as readonly string[]).includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }

  const cleanUsername = sanitiseString(username, 50).trim()
  const [existing] = await pool.execute('SELECT id FROM users WHERE username = ?', [cleanUsername]) as any[]
  if ((existing as any[]).length > 0) {
    return NextResponse.json({ error: 'Username already exists' }, { status: 409 })
  }

  const hash = await bcrypt.hash(password, 12)
  const [result] = await pool.execute(
    'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
    [cleanUsername, hash, role]
  ) as any[]

  await auditLog(auth.id, auth.username, 'create_user', `${cleanUsername} (${role})`, getClientIp(req))

  return NextResponse.json({ id: result.insertId, username: cleanUsername, role }, { status: 201 })
}
