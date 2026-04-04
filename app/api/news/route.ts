import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { initDb } from '@/lib/initDb'

export async function GET() {
  await initDb()
  const [rows] = await pool.execute('SELECT id,slug,date,month,year,category,title,excerpt,image,author,read_time FROM news_articles WHERE published=1 ORDER BY id DESC') as any[]
  const news = (rows as any[]).map(r => ({ ...r, readTime: r.read_time }))
  return NextResponse.json({ news, total: news.length })
}
