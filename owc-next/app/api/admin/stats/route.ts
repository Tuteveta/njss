import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import pool from '@/lib/db'

export async function GET(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const [[news]] = await pool.execute('SELECT COUNT(*) as c FROM news_articles') as any[]
  const [[msgs]] = await pool.execute('SELECT COUNT(*) as c FROM contact_messages') as any[]
  const [[unread]] = await pool.execute('SELECT COUNT(*) as c FROM contact_messages WHERE `read`=0') as any[]
  const [[docs]] = await pool.execute('SELECT COUNT(*) as c FROM documents') as any[]
  return NextResponse.json({ newsCount: news.c, messageCount: msgs.c, unreadCount: unread.c, documentCount: docs.c })
}
