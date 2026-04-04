import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import pool from '@/lib/db'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const d = await req.json()
  const hero_image = d.heroImage ?? d.hero_image ?? ''
  await pool.execute('UPDATE pages SET badge=?,title=?,subtitle=?,hero_image=? WHERE slug=?',
    [d.badge||'', d.title, d.subtitle||'', hero_image, slug])
  return NextResponse.json({ ok: true })
}
