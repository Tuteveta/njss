import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import pool from '@/lib/db'

export async function POST(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const formData = await req.formData()
  const file = formData.get('file') as File
  const title = (formData.get('title') as string) || file.name
  const category = (formData.get('category') as string) || 'General'
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
  const ext = path.extname(file.name)
  const filename = `${uuidv4()}${ext}`
  const uploadDir = path.join(process.cwd(), 'uploads', 'documents')
  await mkdir(uploadDir, { recursive: true })
  const bytes = await file.arrayBuffer()
  await writeFile(path.join(uploadDir, filename), Buffer.from(bytes))
  await pool.execute('INSERT INTO documents (title,category,filename,original_name,file_size) VALUES (?,?,?,?,?)',
    [title, category, filename, file.name, file.size])
  return NextResponse.json({ url: `/uploads/documents/${filename}`, filename })
}
