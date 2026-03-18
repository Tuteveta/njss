import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { initDb } from '@/lib/initDb'

export async function GET() {
  await initDb()
  const [rows] = await pool.execute('SELECT id,title,description,event_date,event_time,location,category,image,published,created_at FROM events WHERE published=1 ORDER BY event_date ASC') as any[]
  return NextResponse.json({ events: rows, total: (rows as any[]).length })
}
