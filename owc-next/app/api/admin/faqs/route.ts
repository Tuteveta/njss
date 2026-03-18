import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import pool from '@/lib/db'

export async function GET(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const [rows] = await pool.execute('SELECT id,question,answer,position,published FROM faqs ORDER BY position') as any[]
  return NextResponse.json({ faqs: rows })
}

export async function POST(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { question, answer, position, published } = await req.json()
  if (!question) return NextResponse.json({ error: 'Question required' }, { status: 400 })
  const [r] = await pool.execute('INSERT INTO faqs (question,answer,position,published) VALUES (?,?,?,?)',
    [question, answer||'', position??0, published??1]) as any[]
  return NextResponse.json({ id: (r as any).insertId })
}
