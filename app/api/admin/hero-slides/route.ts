import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { canWrite } from '@/lib/roles'
import pool from '@/lib/db'

function mapSlide(r: any) {
  return { ...r, ctaLabel: r.cta_label, ctaHref: r.cta_href, ctaExternal: !!r.cta_external, secondaryLabel: r.secondary_label, secondaryHref: r.secondary_href }
}

export async function GET(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const [rows] = await pool.execute('SELECT id,badge,title,subtitle,image,cta_label,cta_href,cta_external,secondary_label,secondary_href,position,published FROM hero_slides ORDER BY position') as any[]
  return NextResponse.json({ slides: (rows as any[]).map(mapSlide) })
}

export async function POST(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!canWrite(user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const d = await req.json()
  if (!d.title) return NextResponse.json({ error: 'Title required' }, { status: 400 })
  const cta_label = d.ctaLabel ?? d.cta_label
  const cta_href = d.ctaHref ?? d.cta_href
  const cta_external = d.ctaExternal ?? d.cta_external
  const secondary_label = d.secondaryLabel ?? d.secondary_label
  const secondary_href = d.secondaryHref ?? d.secondary_href
  const [r] = await pool.execute('INSERT INTO hero_slides (badge,title,subtitle,image,cta_label,cta_href,cta_external,secondary_label,secondary_href,position,published) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
    [d.badge||'', d.title, d.subtitle||'', d.image||'', cta_label||'Learn More', cta_href||'/', cta_external??0, secondary_label||'', secondary_href||'/', d.position??0, d.published??1]) as any[]
  return NextResponse.json({ id: (r as any).insertId })
}
