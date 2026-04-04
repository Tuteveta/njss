import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { initDb } from '@/lib/initDb'

export async function GET() {
  await initDb()
  const [rows] = await pool.execute('SELECT `key`, value FROM site_settings') as any[]
  const obj: Record<string, string> = {}
  for (const r of rows as any[]) obj[r.key] = r.value
  return NextResponse.json(obj)
}
