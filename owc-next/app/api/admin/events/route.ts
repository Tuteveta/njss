import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import pool from '@/lib/db'

export async function GET(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const [rows] = await pool.execute('SELECT id,title,description,event_date,event_time,location,category,image,published,created_at FROM events ORDER BY event_date DESC') as any[]
  return NextResponse.json({ events: rows })
}

export async function POST(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { title, description, event_date, event_time, location, category, image, published } = await req.json()
  if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 })
  const [r] = await pool.execute('INSERT INTO events (title,description,event_date,event_time,location,category,image,published) VALUES (?,?,?,?,?,?,?,?)',
    [title, description||'', event_date||'', event_time||'', location||'', category||'General', image||'', published??1]) as any[]
  return NextResponse.json({ id: (r as any).insertId })
}
