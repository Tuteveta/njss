import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { canWrite } from '@/lib/roles'
import { unlink } from 'fs/promises'
import path from 'path'

const SAFE_FILENAME = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|jpeg|png|gif|webp|svg)$/i

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!canWrite(user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (!SAFE_FILENAME.test(filename)) return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
  try { await unlink(path.join(process.cwd(), 'uploads', 'images', filename)) } catch {}
  return NextResponse.json({ ok: true })
}
