import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import pool from '@/lib/db'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { question, answer, position, published } = await req.json()
  await pool.execute('UPDATE faqs SET question=?,answer=?,position=?,published=? WHERE id=?',
    [question, answer||'', position??0, published??1, id])
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await pool.execute('DELETE FROM faqs WHERE id=?', [id])
  return NextResponse.json({ ok: true })
}
