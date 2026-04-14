import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { canWrite } from '@/lib/roles'
import pool from '@/lib/db'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!canWrite(user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const d = await req.json()
  const cta_label = d.ctaLabel ?? d.cta_label
  const cta_href = d.ctaHref ?? d.cta_href
  const cta_external = d.ctaExternal ?? d.cta_external
  const secondary_label = d.secondaryLabel ?? d.secondary_label
  const secondary_href = d.secondaryHref ?? d.secondary_href
  await pool.execute('UPDATE hero_slides SET badge=?,title=?,subtitle=?,image=?,cta_label=?,cta_href=?,cta_external=?,secondary_label=?,secondary_href=?,position=?,published=? WHERE id=?',
    [d.badge||'', d.title||'', d.subtitle||'', d.image||'', cta_label||'Learn More', cta_href||'/', cta_external??0, secondary_label||'', secondary_href||'/', d.position??0, d.published??1, id])
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!canWrite(user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  await pool.execute('DELETE FROM hero_slides WHERE id=?', [id])
  return NextResponse.json({ ok: true })
}
