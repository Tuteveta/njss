import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { canWrite } from '@/lib/roles'
import pool from '@/lib/db'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!canWrite(user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { name, address, phone, email, hours, position } = await req.json()
  await pool.execute('UPDATE offices SET name=?,address=?,phone=?,email=?,hours=?,position=? WHERE id=?',
    [name, address||'', phone||'', email||'', hours||'Mon–Fri: 8:00 AM – 4:00 PM', position??0, id])
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!canWrite(user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  await pool.execute('DELETE FROM offices WHERE id=?', [id])
  return NextResponse.json({ ok: true })
}
