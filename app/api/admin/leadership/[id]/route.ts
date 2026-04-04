import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import pool from '@/lib/db'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { name, title, since, photo, position } = await req.json()
  await pool.execute('UPDATE leadership SET name=?,title=?,since=?,photo=?,position=? WHERE id=?',
    [name, title||'', since||'', photo||'', position??0, id])
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await pool.execute('DELETE FROM leadership WHERE id=?', [id])
  return NextResponse.json({ ok: true })
}
