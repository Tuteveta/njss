import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { initDb } from '@/lib/initDb'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') ?? '').trim()
  if (q.length < 2) return NextResponse.json({ results: [] })

  await initDb()
  const like = `%${q}%`

  const [news] = await pool.execute(
    `SELECT id, slug, title, excerpt, category FROM news_articles
     WHERE published = 1 AND (title LIKE ? OR excerpt LIKE ?)
     ORDER BY id DESC LIMIT 3`,
    [like, like]
  ) as any[]

  const [events] = await pool.execute(
    `SELECT id, title, description, event_date, location FROM events
     WHERE published = 1 AND (title LIKE ? OR description LIKE ?)
     ORDER BY event_date ASC LIMIT 3`,
    [like, like]
  ) as any[]

  const [services] = await pool.execute(
    `SELECT id, title, description, tag FROM services
     WHERE published = 1 AND (title LIKE ? OR description LIKE ?)
     ORDER BY position LIMIT 3`,
    [like, like]
  ) as any[]

  const results = [
    ...(news    as any[]).map((r: any) => ({ type: 'news',    id: r.id, title: r.title, meta: r.category,   url: `/news/${r.slug}` })),
    ...(events  as any[]).map((r: any) => ({ type: 'event',   id: r.id, title: r.title, meta: r.location?.split(',')[0], url: '/events' })),
    ...(services as any[]).map((r: any) => ({ type: 'service', id: r.id, title: r.title, meta: r.tag,        url: '/services' })),
  ]

  return NextResponse.json({ results })
}
