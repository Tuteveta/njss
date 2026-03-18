import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import pool from '@/lib/db'

export async function GET(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const [rows] = await pool.execute('SELECT id,label,href,position FROM menu_items ORDER BY position') as any[]
  return NextResponse.json({ items: rows })
}

export async function PUT(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { items } = await req.json()
  await pool.execute('DELETE FROM menu_items')
  for (let i = 0; i < items.length; i++) {
    await pool.execute('INSERT INTO menu_items (label,href,position) VALUES (?,?,?)', [items[i].label, items[i].href, i])
  }
  return NextResponse.json({ ok: true })
}
