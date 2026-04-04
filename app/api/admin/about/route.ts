import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import pool from '@/lib/db'

const ABOUT_KEYS = ['mission', 'vision', 'mandate', 'highlights', 'priorities', 'values', 'legislation']
const ARRAY_KEYS = new Set(['mandate', 'highlights', 'priorities', 'values', 'legislation'])

export async function GET(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const placeholders = ABOUT_KEYS.map(() => '?').join(',')
  const [rows] = await pool.execute(`SELECT \`key\`, value FROM site_settings WHERE \`key\` IN (${placeholders})`, ABOUT_KEYS) as any[]
  const obj: Record<string, any> = {}
  for (const r of rows as any[]) {
    obj[r.key] = ARRAY_KEYS.has(r.key) ? (() => { try { return JSON.parse(r.value) } catch { return [] } })() : r.value
  }
  return NextResponse.json(obj)
}

export async function PUT(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json()
  for (const [k, v] of Object.entries(data)) {
    const stored = typeof v === 'string' ? v : JSON.stringify(v)
    await pool.execute('INSERT INTO site_settings (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value=?', [k, stored, stored])
  }
  return NextResponse.json({ ok: true })
}
