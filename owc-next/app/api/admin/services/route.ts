import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import pool from '@/lib/db'

export async function GET(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const [rows] = await pool.execute('SELECT id,position,tag,icon_name,title,description,who_eligible,benefits,published FROM services ORDER BY position') as any[]
  return NextResponse.json({ services: (rows as any[]).map((r: any) => ({ ...r, benefits: JSON.parse(r.benefits || '[]') })) })
}

export async function POST(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { tag, icon_name, title, description, who_eligible, benefits, published, position } = await req.json()
  if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 })
  const [r] = await pool.execute('INSERT INTO services (tag,icon_name,title,description,who_eligible,benefits,published,position) VALUES (?,?,?,?,?,?,?,?)',
    [tag||'', icon_name||'HelpCircle', title, description||'', who_eligible||'', JSON.stringify(benefits||[]), published??1, position??0]) as any[]
  return NextResponse.json({ id: (r as any).insertId })
}
