import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { initDb } from '@/lib/initDb'

export async function GET() {
  await initDb()
  const [rows] = await pool.execute('SELECT id,badge,title,subtitle,image,cta_label,cta_href,cta_external,secondary_label,secondary_href,position FROM hero_slides WHERE published=1 ORDER BY position') as any[]
  const slides = (rows as any[]).map(r => ({ ...r, ctaLabel: r.cta_label, ctaHref: r.cta_href, ctaExternal: !!r.cta_external, secondaryLabel: r.secondary_label, secondaryHref: r.secondary_href }))
  return NextResponse.json({ slides })
}
