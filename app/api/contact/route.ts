import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { initDb } from '@/lib/initDb'
import { sanitiseString, sanitiseEmail } from '@/lib/sanitise'
import { checkRateLimit, recordFailure, recordSuccess, getClientIp } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  await initDb()

  const ip = getClientIp(req)
  const { allowed, retryAfterSecs } = checkRateLimit(ip, 'contact')
  if (!allowed) {
    return NextResponse.json(
      { error: `Too many submissions. Please try again later.` },
      { status: 429, headers: { 'Retry-After': String(retryAfterSecs) } }
    )
  }

  const body = await req.json()
  const name    = sanitiseString(body.name,    200)
  const email   = sanitiseEmail(body.email)
  const subject = sanitiseString(body.subject, 300)
  const message = sanitiseString(body.message, 2000)

  if (!name || !email || !subject || !message) {
    recordFailure(ip, 'contact')
    return NextResponse.json({ error: 'All fields are required and must be valid.' }, { status: 400 })
  }

  await pool.execute(
    'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
    [name, email, subject, message]
  )

  recordSuccess(ip, 'contact')
  return NextResponse.json({ ok: true })
}
