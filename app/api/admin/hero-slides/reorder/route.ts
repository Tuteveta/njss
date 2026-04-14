import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { canWrite } from '@/lib/roles'
import pool from '@/lib/db'

export async function PUT(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!canWrite(user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { ids } = await req.json()
  for (let i = 0; i < ids.length; i++) await pool.execute('UPDATE hero_slides SET position=? WHERE id=?', [i, ids[i]])
  return NextResponse.json({ ok: true })
}
