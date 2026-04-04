import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import pool from '@/lib/db'
import bcrypt from 'bcryptjs'
import { checkRateLimit, recordFailure, recordSuccess, getClientIp } from '@/lib/rateLimit'
import { validatePassword } from '@/lib/validate'
import { auditLog } from '@/lib/audit'

export async function PUT(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const ip = getClientIp(req)
  const { allowed, retryAfterSecs } = checkRateLimit(ip, 'changePassword')
  if (!allowed) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${Math.ceil(retryAfterSecs / 60)} minute(s).` },
      { status: 429, headers: { 'Retry-After': String(retryAfterSecs) } }
    )
  }

  const body = await req.json()
  const { current } = body
  const newPass = body.new

  const passError = validatePassword(newPass)
  if (passError) {
    recordFailure(ip, 'changePassword')
    return NextResponse.json({ error: passError }, { status: 400 })
  }

  const [rows] = await pool.execute('SELECT password_hash FROM users WHERE id = ?', [user.id]) as any[]
  const u = (rows as any[])[0]
  if (!u || !(await bcrypt.compare(current, u.password_hash))) {
    recordFailure(ip, 'changePassword')
    return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
  }

  const hash = await bcrypt.hash(newPass, 12)
  await pool.execute('UPDATE users SET password_hash = ? WHERE id = ?', [hash, user.id])
  recordSuccess(ip, 'changePassword')

  await auditLog(user.id, user.username, 'change_password', 'Password changed', ip)

  return NextResponse.json({ ok: true })
}
