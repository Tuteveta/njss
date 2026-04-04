import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { unlink } from 'fs/promises'
import path from 'path'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try { await unlink(path.join(process.cwd(), 'uploads', 'images', filename)) } catch {}
  return NextResponse.json({ ok: true })
}
