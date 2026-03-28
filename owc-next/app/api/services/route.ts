import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { initDb } from '@/lib/initDb'

export async function GET() {
  await initDb()
  const [rows] = await pool.execute('SELECT id,position,tag,icon_name,title,description,who_eligible,benefits FROM services WHERE published=1 ORDER BY position') as any[]
  const seen = new Set<string>()
  const unique = (rows as any[]).filter((r: any) => {
    if (seen.has(r.title)) return false
    seen.add(r.title)
    return true
  })
  return NextResponse.json({ services: unique.map((r: any) => ({ ...r, iconName: r.icon_name, whoEligible: r.who_eligible, benefits: JSON.parse(r.benefits || '[]') })) })
}
