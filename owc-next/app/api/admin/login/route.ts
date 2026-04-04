import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'
import { initDb } from '@/lib/initDb'
import { checkRateLimit, recordFailure, recordSuccess, getClientIp } from '@/lib/rateLimit'
import { auditLog } from '@/lib/audit'

export async function POST(req: NextRequest) {
  await initDb()

  const ip = getClientIp(req)
  const { allowed, retryAfterSecs } = checkRateLimit(ip, 'login')

  if (!allowed) {
    return NextResponse.json(
      { error: `Too many failed attempts. Try again in ${Math.ceil(retryAfterSecs / 60)} minute(s).` },
      { status: 429, headers: { 'Retry-After': String(retryAfterSecs) } }
    )
  }

  let body: { username?: unknown; password?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { username, password } = body

  if (typeof username !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE username = ? LIMIT 1', [username.slice(0, 50)]
  ) as any[]
  const user = (rows as any[])[0]

  // Always run bcrypt compare to prevent timing attacks
  const dummyHash = '$2b$12$invalidhashfortimingprotection000000000000000000000000'
  const passwordMatch = user
    ? await bcrypt.compare(password, user.password_hash)
    : await bcrypt.compare(password, dummyHash).then(() => false)

  if (!user || !passwordMatch) {
    recordFailure(ip, 'login')
    await auditLog(null, username.slice(0, 50), 'login_failed', `IP: ${ip}`, ip)
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  recordSuccess(ip, 'login')
  const token = signToken({ id: user.id, username: user.username, role: user.role })

  await auditLog(user.id, user.username, 'login', `IP: ${ip}`, ip)

  const res = NextResponse.json({ token, username: user.username, role: user.role })
  res.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 86400,
    path: '/',
  })
  return res
}
