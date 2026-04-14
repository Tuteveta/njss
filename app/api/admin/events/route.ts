import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { canWrite } from '@/lib/roles'
import pool from '@/lib/db'

export async function GET(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const [rows] = await pool.execute('SELECT id,title,description,event_date,event_time,location,category,image,published,created_at FROM events ORDER BY event_date DESC') as any[]
  const events = (rows as any[]).map(r => ({ ...r, eventDate: r.event_date, eventTime: r.event_time }))
  return NextResponse.json({ events })
}

export async function POST(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!canWrite(user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const d = await req.json()
  const title = d.title
  const description = d.description
  const event_date = d.eventDate ?? d.event_date
  const event_time = d.eventTime ?? d.event_time
  const { location, category, image, published } = d
  if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 })
  const [r] = await pool.execute('INSERT INTO events (title,description,event_date,event_time,location,category,image,published) VALUES (?,?,?,?,?,?,?,?)',
    [title, description||'', event_date||'', event_time||'', location||'', category||'General', image||'', published??1]) as any[]
  return NextResponse.json({ id: (r as any).insertId })
}
