import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import bcrypt from 'bcryptjs'
import { requireAuth } from '@/lib/auth'
import { isSuperAdmin, ROLES } from '@/lib/roles'
import { validatePassword } from '@/lib/validate'
import { auditLog } from '@/lib/audit'
import { getClientIp } from '@/lib/rateLimit'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isSuperAdmin(auth.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const id = parseInt(params.id)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  if (auth.id === id) {
    return NextResponse.json({ error: 'Cannot modify your own account through this endpoint' }, { status: 400 })
  }

  const { role, password } = await req.json()
  const changes: string[] = []

  if (role !== undefined) {
    if (!(ROLES as readonly string[]).includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }
    await pool.execute('UPDATE users SET role = ? WHERE id = ?', [role, id])
    changes.push(`role → ${role}`)
  }

  if (password !== undefined && password !== '') {
    const passError = validatePassword(password)
    if (passError) return NextResponse.json({ error: passError }, { status: 400 })
    const hash = await bcrypt.hash(password, 12)
    await pool.execute('UPDATE users SET password_hash = ? WHERE id = ?', [hash, id])
    changes.push('password reset')
  }

  if (changes.length > 0) {
    await auditLog(auth.id, auth.username, 'update_user', `user_id=${id}: ${changes.join(', ')}`, getClientIp(req))
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isSuperAdmin(auth.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const id = parseInt(params.id)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  if (auth.id === id) {
    return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
  }

  // Prevent deleting the last superadmin
  const [rows] = await pool.execute(
    "SELECT COUNT(*) as cnt FROM users WHERE role = 'superadmin' AND id != ?", [id]
  ) as any[]
  if ((rows as any[])[0]?.cnt === 0) {
    return NextResponse.json({ error: 'Cannot delete the last superadmin account' }, { status: 400 })
  }

  const [target] = await pool.execute('SELECT username FROM users WHERE id = ?', [id]) as any[]
  const targetUsername = (target as any[])[0]?.username ?? `id=${id}`

  await pool.execute('DELETE FROM users WHERE id = ?', [id])
  await auditLog(auth.id, auth.username, 'delete_user', targetUsername, getClientIp(req))

  return NextResponse.json({ ok: true })
}
