import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import pool from '@/lib/db'

export async function GET(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const [rows] = await pool.execute('SELECT id,name,address,phone,email,hours,position FROM offices ORDER BY position') as any[]
  return NextResponse.json({ offices: rows })
}

export async function POST(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { name, address, phone, email, hours, position } = await req.json()
  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 })
  const [r] = await pool.execute('INSERT INTO offices (name,address,phone,email,hours,position) VALUES (?,?,?,?,?,?)',
    [name, address||'', phone||'', email||'', hours||'Mon–Fri: 8:00 AM – 4:00 PM', position??0]) as any[]
  return NextResponse.json({ id: (r as any).insertId })
}
