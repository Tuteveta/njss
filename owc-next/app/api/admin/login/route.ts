import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'
import { initDb } from '@/lib/initDb'

export async function POST(req: NextRequest) {
  await initDb()
  const { username, password } = await req.json()
  const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]) as any[]
  const user = (rows as any[])[0]
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
  const token = signToken({ id: user.id, username: user.username, role: user.role })
  const res = NextResponse.json({ token, username: user.username, role: user.role })
  res.cookies.set('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 86400 })
  return res
}
