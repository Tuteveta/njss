import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { initDb } from '@/lib/initDb'

export async function POST(req: NextRequest) {
  await initDb()
  const { name, email, subject, message } = await req.json()
  if (!name || !email || !subject || !message) return NextResponse.json({ error: 'All fields required' }, { status: 400 })
  await pool.execute('INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)', [name, email, subject, message])
  return NextResponse.json({ ok: true })
}
