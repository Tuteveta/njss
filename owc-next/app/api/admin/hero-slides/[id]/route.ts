import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import pool from '@/lib/db'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const d = await req.json()
  await pool.execute('UPDATE hero_slides SET badge=?,title=?,subtitle=?,image=?,cta_label=?,cta_href=?,cta_external=?,secondary_label=?,secondary_href=?,position=?,published=? WHERE id=?',
    [d.badge||'', d.title, d.subtitle||'', d.image||'', d.cta_label||'Learn More', d.cta_href||'/', d.cta_external??0, d.secondary_label||'', d.secondary_href||'/', d.position??0, d.published??1, id])
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await pool.execute('DELETE FROM hero_slides WHERE id=?', [id])
  return NextResponse.json({ ok: true })
}
