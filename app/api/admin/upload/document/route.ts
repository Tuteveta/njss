import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { canWrite } from '@/lib/roles'
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
  if (!canWrite(user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

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

  // Magic bytes validation
  const bytes = await file.arrayBuffer()
  const buf = Buffer.from(bytes)

  // PDF: %PDF
  if (ext === '.pdf' && !(buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46)) {
    return NextResponse.json({ error: 'File content does not match PDF format' }, { status: 415 })
  }
  // DOCX/XLSX (ZIP-based Office): PK\x03\x04
  if ((ext === '.docx' || ext === '.xlsx') && !(buf[0] === 0x50 && buf[1] === 0x4B && buf[2] === 0x03 && buf[3] === 0x04)) {
    return NextResponse.json({ error: 'File content does not match Office Open XML format' }, { status: 415 })
  }
  // DOC/XLS (OLE2 Compound): D0 CF 11 E0
  if ((ext === '.doc' || ext === '.xls') && !(buf[0] === 0xD0 && buf[1] === 0xCF && buf[2] === 0x11 && buf[3] === 0xE0)) {
    return NextResponse.json({ error: 'File content does not match legacy Office format' }, { status: 415 })
  }

  const filename = `${uuidv4()}${ext}`
  const uploadDir = path.join(process.cwd(), 'uploads', 'documents')
  await mkdir(uploadDir, { recursive: true })
  await writeFile(path.join(uploadDir, filename), buf)

  await pool.execute(
    'INSERT INTO documents (title, category, filename, original_name, file_size) VALUES (?, ?, ?, ?, ?)',
    [title, category, filename, sanitiseString(file.name, 255), file.size]
  )

  await auditLog(user.id, user.username, 'upload_document', `${title} (${filename})`, getClientIp(req))

  return NextResponse.json({ url: `/uploads/documents/${filename}`, filename })
}
