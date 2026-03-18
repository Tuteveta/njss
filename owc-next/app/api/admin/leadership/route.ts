import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import pool from '@/lib/db'

export async function GET(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const [rows] = await pool.execute('SELECT id,name,title,since,photo,position FROM leadership ORDER BY position') as any[]
  return NextResponse.json({ members: rows })
}

export async function POST(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { name, title, since, photo, position } = await req.json()
  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 })
  const [r] = await pool.execute('INSERT INTO leadership (name,title,since,photo,position) VALUES (?,?,?,?,?)',
    [name, title||'', since||'', photo||'', position??0]) as any[]
  return NextResponse.json({ id: (r as any).insertId })
}
