import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { ALLOWED_IMAGE_MIMES, MAX_IMAGE_BYTES } from '@/lib/validate'
import { auditLog } from '@/lib/audit'
import { getClientIp } from '@/lib/rateLimit'

// Allowed extensions derived from allowed MIME types
const ALLOWED_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'])

export async function POST(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  // Size check
  if (file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: 'File exceeds 5 MB limit' }, { status: 413 })
  }

  // MIME type check
  if (!ALLOWED_IMAGE_MIMES.has(file.type)) {
    return NextResponse.json({ error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP, SVG' }, { status: 415 })
  }

  // Extension check (defence-in-depth)
  const ext = path.extname(file.name).toLowerCase()
  if (!ALLOWED_EXTS.has(ext)) {
    return NextResponse.json({ error: 'Invalid file extension' }, { status: 415 })
  }

  // Read file bytes and verify magic bytes for common types
  const bytes = await file.arrayBuffer()
  const buf = Buffer.from(bytes)

  // JPEG magic: FF D8 FF
  if ((ext === '.jpg' || ext === '.jpeg') && !(buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF)) {
    return NextResponse.json({ error: 'File content does not match JPEG format' }, { status: 415 })
  }
  // PNG magic: 89 50 4E 47
  if (ext === '.png' && !(buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47)) {
    return NextResponse.json({ error: 'File content does not match PNG format' }, { status: 415 })
  }

  const filename = `${uuidv4()}${ext}`
  const uploadDir = path.join(process.cwd(), 'uploads', 'images')
  await mkdir(uploadDir, { recursive: true })
  await writeFile(path.join(uploadDir, filename), buf)

  await auditLog(user.id, user.username, 'upload_image', filename, getClientIp(req))

  return NextResponse.json({ url: `/uploads/images/${filename}`, filename })
}
