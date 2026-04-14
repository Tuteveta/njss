import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { canWrite } from '@/lib/roles'
import pool from '@/lib/db'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const [rows] = await pool.execute('SELECT * FROM events WHERE id=?', [id]) as any[]
  if (!(rows as any[]).length) return NextResponse.json({ error: 'not found' }, { status: 404 })
  const r = (rows as any[])[0]
  return NextResponse.json({ ...r, eventDate: r.event_date, eventTime: r.event_time })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!canWrite(user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const d = await req.json()
  const event_date = d.eventDate ?? d.event_date
  const event_time = d.eventTime ?? d.event_time
  const { title, description, location, category, image, published } = d
  await pool.execute('UPDATE events SET title=?,description=?,event_date=?,event_time=?,location=?,category=?,image=?,published=? WHERE id=?',
    [title, description||'', event_date||'', event_time||'', location||'', category||'General', image||'', published??1, id])
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!canWrite(user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  await pool.execute('DELETE FROM events WHERE id=?', [id])
  return NextResponse.json({ ok: true })
}
