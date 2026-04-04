import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { readdir, stat } from 'fs/promises'
import path from 'path'

export async function GET(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const dir = path.join(process.cwd(), 'uploads', 'images')
    const files = await readdir(dir)
    const imageFiles = files.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
    const images = await Promise.all(imageFiles.map(async f => {
      const s = await stat(path.join(dir, f)).catch(() => null)
      return { filename: f, url: `/uploads/images/${f}`, size: s?.size ?? 0, uploadedAt: s?.mtime?.toISOString() ?? '' }
    }))
    images.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))
    return NextResponse.json({ images })
  } catch { return NextResponse.json({ images: [] }) }
}
