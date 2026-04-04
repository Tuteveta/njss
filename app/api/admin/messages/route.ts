import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import pool from '@/lib/db'

export async function GET(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const [rows] = await pool.execute('SELECT id,name,email,subject,message,`read`,received_at FROM contact_messages ORDER BY received_at DESC') as any[]
  const messages = (rows as any[]).map(r => ({ ...r, receivedAt: r.received_at }))
  return NextResponse.json({ messages })
}
