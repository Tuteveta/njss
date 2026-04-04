import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import pool from '@/lib/db'

export async function GET(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const [rows] = await pool.execute('SELECT id,username,action,detail,ip,ts FROM audit_log ORDER BY ts DESC LIMIT 500') as any[]
  const entries = (rows as any[]).map(r => ({ ...r, createdAt: r.ts }))
  return NextResponse.json({ entries })
}
