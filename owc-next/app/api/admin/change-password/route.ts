import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import pool from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function PUT(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const { current } = body
  const newPass = body.new
  const [rows] = await pool.execute('SELECT password_hash FROM users WHERE id=?', [user.id]) as any[]
  const u = (rows as any[])[0]
  if (!u || !(await bcrypt.compare(current, u.password_hash))) return NextResponse.json({ error: 'Current password incorrect' }, { status: 400 })
  const hash = await bcrypt.hash(newPass, 12)
  await pool.execute('UPDATE users SET password_hash=? WHERE id=?', [hash, user.id])
  return NextResponse.json({ ok: true })
}
