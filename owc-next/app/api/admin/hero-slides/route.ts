import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import pool from '@/lib/db'

export async function GET(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const [rows] = await pool.execute('SELECT id,badge,title,subtitle,image,cta_label,cta_href,cta_external,secondary_label,secondary_href,position,published FROM hero_slides ORDER BY position') as any[]
  return NextResponse.json({ slides: rows })
}

export async function POST(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const d = await req.json()
  if (!d.title) return NextResponse.json({ error: 'Title required' }, { status: 400 })
  const [r] = await pool.execute('INSERT INTO hero_slides (badge,title,subtitle,image,cta_label,cta_href,cta_external,secondary_label,secondary_href,position,published) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
    [d.badge||'', d.title, d.subtitle||'', d.image||'', d.cta_label||'Learn More', d.cta_href||'/', d.cta_external??0, d.secondary_label||'', d.secondary_href||'/', d.position??0, d.published??1]) as any[]
  return NextResponse.json({ id: (r as any).insertId })
}
