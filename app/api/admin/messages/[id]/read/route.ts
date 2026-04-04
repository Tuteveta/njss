import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import pool from '@/lib/db'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await pool.execute('UPDATE contact_messages SET `read`=1 WHERE id=?', [id])
  return NextResponse.json({ ok: true })
}
