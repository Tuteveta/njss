import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import pool from '@/lib/db'
import { unlink } from 'fs/promises'
import path from 'path'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const [rows] = await pool.execute('SELECT filename FROM documents WHERE id=?', [id]) as any[]
  const doc = (rows as any[])[0]
  if (doc) { try { await unlink(path.join(process.cwd(), 'uploads', 'documents', doc.filename)) } catch {} }
  await pool.execute('DELETE FROM documents WHERE id=?', [id])
  return NextResponse.json({ ok: true })
}
