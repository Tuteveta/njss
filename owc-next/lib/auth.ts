import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'owc-secret-change-in-prod'

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: number; username: string; role: string }
  } catch {
    return null
  }
}

export function getAuth(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const bearerToken = authHeader?.replace('Bearer ', '')
  const cookieToken = req.cookies.get('token')?.value
  const token = bearerToken || cookieToken
  if (!token) return null
  return verifyToken(token)
}

export function requireAuth(req: NextRequest) {
  return getAuth(req)
}
