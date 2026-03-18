import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { initDb } from '@/lib/initDb'

export async function GET() {
  await initDb()
  const [rows] = await pool.execute('SELECT id,question,answer,position FROM faqs WHERE published=1 ORDER BY position') as any[]
  return NextResponse.json({ faqs: rows })
}
