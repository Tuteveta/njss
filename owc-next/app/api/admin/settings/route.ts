import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { isSuperAdmin } from '@/lib/roles'
import pool from '@/lib/db'
import { sanitiseString } from '@/lib/sanitise'
import { ALLOWED_SETTINGS_KEYS } from '@/lib/validate'
import { auditLog } from '@/lib/audit'
import { getClientIp } from '@/lib/rateLimit'

export async function GET(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [rows] = await pool.execute('SELECT `key`, value FROM site_settings') as any[]
  const obj: Record<string, string> = {}
  for (const r of rows as any[]) obj[r.key] = r.value
  return NextResponse.json(obj)
}

export async function PUT(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isSuperAdmin(user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const data = await req.json()
  if (typeof data !== 'object' || Array.isArray(data)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const updated: string[] = []
  for (const [k, v] of Object.entries(data) as [string, unknown][]) {
    // Whitelist: only allow known settings keys
    if (!ALLOWED_SETTINGS_KEYS.has(k)) continue
    const sanitised = sanitiseString(v as string, 2000)
    await pool.execute(
      'INSERT INTO site_settings (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?',
      [k, sanitised, sanitised]
    )
    updated.push(k)
  }

  await auditLog(user.id, user.username, 'update_settings', `Keys: ${updated.join(', ')}`, getClientIp(req))

  return NextResponse.json({ ok: true })
}
