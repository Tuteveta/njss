import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import pool from '@/lib/db'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { tag, icon_name, title, description, who_eligible, benefits, published, position } = await req.json()
  await pool.execute('UPDATE services SET tag=?,icon_name=?,title=?,description=?,who_eligible=?,benefits=?,published=?,position=? WHERE id=?',
    [tag||'', icon_name||'HelpCircle', title, description||'', who_eligible||'', JSON.stringify(benefits||[]), published??1, position??0, id])
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await pool.execute('DELETE FROM services WHERE id=?', [id])
  return NextResponse.json({ ok: true })
}
