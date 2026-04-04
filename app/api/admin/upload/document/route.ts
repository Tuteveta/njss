import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import pool from '@/lib/db'
import { ALLOWED_DOCUMENT_MIMES, MAX_DOCUMENT_BYTES } from '@/lib/validate'
import { sanitiseString } from '@/lib/sanitise'
import { auditLog } from '@/lib/audit'
import { getClientIp } from '@/lib/rateLimit'

const ALLOWED_EXTS = new Set(['.pdf', '.doc', '.docx', '.xls', '.xlsx'])

export async function POST(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file     = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  // Size check
  if (file.size > MAX_DOCUMENT_BYTES) {
    return NextResponse.json({ error: 'File exceeds 20 MB limit' }, { status: 413 })
  }

  // MIME type check
  if (!ALLOWED_DOCUMENT_MIMES.has(file.type)) {
    return NextResponse.json({ error: 'Invalid file type. Allowed: PDF, Word, Excel' }, { status: 415 })
  }

  // Extension check
  const ext = path.extname(file.name).toLowerCase()
  if (!ALLOWED_EXTS.has(ext)) {
    return NextResponse.json({ error: 'Invalid file extension' }, { status: 415 })
  }

  const title    = sanitiseString(formData.get('title') as string || file.name, 300)
  const category = sanitiseString(formData.get('category') as string || 'General', 100)

  const filename = `${uuidv4()}${ext}`
  const uploadDir = path.join(process.cwd(), 'uploads', 'documents')
  await mkdir(uploadDir, { recursive: true })
  const bytes = await file.arrayBuffer()
  await writeFile(path.join(uploadDir, filename), Buffer.from(bytes))

  await pool.execute(
    'INSERT INTO documents (title, category, filename, original_name, file_size) VALUES (?, ?, ?, ?, ?)',
    [title, category, filename, sanitiseString(file.name, 255), file.size]
  )

  await auditLog(user.id, user.username, 'upload_document', `${title} (${filename})`, getClientIp(req))

  return NextResponse.json({ url: `/uploads/documents/${filename}`, filename })
}
