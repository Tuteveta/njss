import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { canWrite } from '@/lib/roles'
import pool from '@/lib/db'

export async function GET(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const [rows] = await pool.execute('SELECT id,slug,date,month,year,category,title,excerpt,image,author,read_time,published,created_at FROM news_articles ORDER BY id DESC') as any[]
  return NextResponse.json({ news: rows })
}

export async function POST(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!canWrite(user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const d = await req.json()
  const slug = d.slug || d.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
  const [r] = await pool.execute(
    'INSERT INTO news_articles (slug,date,month,year,category,title,excerpt,image,author,read_time,body,published) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
    [slug, d.date||'', d.month||'', d.year||'', d.category||'General', d.title, d.excerpt||'', d.image||'', d.author||'NJSS Communications', d.read_time||'3 min read', JSON.stringify(d.body||[]), d.published??1]
  ) as any[]
  return NextResponse.json({ id: (r as any).insertId, slug })
}
