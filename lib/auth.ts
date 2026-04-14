import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

function getSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET environment variable must be set to at least 32 characters')
  }
  return secret
}

export function signToken(payload: object) {
  return jwt.sign(payload, getSecret(), { expiresIn: '8h', algorithm: 'HS256' })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, getSecret(), { algorithms: ['HS256'] }) as {
      id: number
      username: string
      role: string
    }
  } catch {
    return null
  }
}

export function getAuth(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  const cookieToken = req.cookies.get('token')?.value
  // Prefer cookie (HttpOnly) over Authorization header
  const token = cookieToken || bearerToken
  if (!token) return null
  return verifyToken(token)
}

export function requireAuth(req: NextRequest) {
  return getAuth(req)
}
