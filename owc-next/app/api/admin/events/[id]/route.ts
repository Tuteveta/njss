import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import pool from '@/lib/db'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const [rows] = await pool.execute('SELECT * FROM events WHERE id=?', [id]) as any[]
  if (!(rows as any[]).length) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return NextResponse.json((rows as any[])[0])
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { title, description, event_date, event_time, location, category, image, published } = await req.json()
  await pool.execute('UPDATE events SET title=?,description=?,event_date=?,event_time=?,location=?,category=?,image=?,published=? WHERE id=?',
    [title, description||'', event_date||'', event_time||'', location||'', category||'General', image||'', published??1, id])
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await pool.execute('DELETE FROM events WHERE id=?', [id])
  return NextResponse.json({ ok: true })
}
