import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { initDb } from '@/lib/initDb'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  await initDb()
  const [rows] = await pool.execute('SELECT * FROM news_articles WHERE slug=? AND published=1', [slug]) as any[]
  if (!(rows as any[]).length) return NextResponse.json({ error: 'not found' }, { status: 404 })
  const a = (rows as any[])[0]
  return NextResponse.json({ ...a, body: JSON.parse(a.body || '[]') })
}
