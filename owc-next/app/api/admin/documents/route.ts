import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import pool from '@/lib/db'

export async function GET(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const [rows] = await pool.execute('SELECT id,title,category,filename,original_name,file_size,uploaded_at FROM documents ORDER BY uploaded_at DESC') as any[]
  const docs = (rows as any[]).map((d: any) => ({ ...d, url: `/uploads/documents/${d.filename}` }))
  return NextResponse.json({ documents: docs })
}
