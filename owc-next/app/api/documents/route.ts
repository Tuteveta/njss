import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { initDb } from '@/lib/initDb'

export async function GET() {
  await initDb()
  const [rows] = await pool.execute('SELECT id,title,category,filename,original_name,file_size,uploaded_at FROM documents ORDER BY uploaded_at DESC') as any[]
  const docs = (rows as any[]).map((d: any) => ({ ...d, url: `/uploads/documents/${d.filename}` }))
  return NextResponse.json({ documents: docs, total: docs.length })
}
