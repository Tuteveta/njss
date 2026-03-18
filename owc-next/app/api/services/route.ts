import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { initDb } from '@/lib/initDb'

export async function GET() {
  await initDb()
  const [rows] = await pool.execute('SELECT id,position,tag,icon_name,title,description,who_eligible,benefits FROM services WHERE published=1 ORDER BY position') as any[]
  return NextResponse.json({ services: (rows as any[]).map((r: any) => ({ ...r, benefits: JSON.parse(r.benefits || '[]') })) })
}
