import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import pool from '@/lib/db'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const [rows] = await pool.execute('SELECT * FROM news_articles WHERE id=?', [id]) as any[]
  if (!(rows as any[]).length) return NextResponse.json({ error: 'not found' }, { status: 404 })
  const a = (rows as any[])[0]
  return NextResponse.json({ ...a, body: JSON.parse(a.body || '[]') })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const d = await req.json()
  const read_time = d.readTime ?? d.read_time
  await pool.execute(
    'UPDATE news_articles SET date=?,month=?,year=?,category=?,title=?,excerpt=?,image=?,author=?,read_time=?,body=?,published=? WHERE id=?',
    [d.date||'', d.month||'', d.year||'', d.category||'General', d.title, d.excerpt||'', d.image||'', d.author||'NJSS Communications', read_time||'3 min read', JSON.stringify(d.body||[]), d.published??1, id]
  )
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await pool.execute('DELETE FROM news_articles WHERE id=?', [id])
  return NextResponse.json({ ok: true })
}
