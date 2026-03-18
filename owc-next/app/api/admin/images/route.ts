import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { readdir } from 'fs/promises'
import path from 'path'

export async function GET(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const dir = path.join(process.cwd(), 'uploads', 'images')
    const files = await readdir(dir)
    const images = files.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f)).map(f => ({ filename: f, url: `/uploads/images/${f}` }))
    return NextResponse.json({ images })
  } catch { return NextResponse.json({ images: [] }) }
}
