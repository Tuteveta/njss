import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { initDb } from '@/lib/initDb'

export async function GET() {
  await initDb()
  const [rows] = await pool.execute('SELECT id,name,title,since,photo,position FROM leadership ORDER BY position') as any[]
  return NextResponse.json({ members: rows })
}
