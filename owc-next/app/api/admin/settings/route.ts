import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import pool from '@/lib/db'

export async function GET(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const [rows] = await pool.execute('SELECT `key`, value FROM site_settings') as any[]
  const obj: Record<string, string> = {}
  for (const r of rows as any[]) obj[r.key] = r.value
  return NextResponse.json(obj)
}

export async function PUT(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json()
  for (const [k, v] of Object.entries(data) as [string, string][]) {
    await pool.execute('INSERT INTO site_settings (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value=?', [k, v, v])
  }
  return NextResponse.json({ ok: true })
}
