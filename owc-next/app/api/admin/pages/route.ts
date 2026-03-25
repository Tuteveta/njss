import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import pool from '@/lib/db'

export async function GET(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const [rows] = await pool.execute('SELECT id,slug,badge,title,subtitle,hero_image,updated_at FROM pages ORDER BY slug') as any[]
  const pages = (rows as any[]).map(r => ({ ...r, heroImage: r.hero_image }))
  return NextResponse.json({ pages })
}
