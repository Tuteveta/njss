// Generic in-memory rate limiter — no external dependencies required
// Tracks attempts per IP+key; auto-clears stale entries

interface Entry { count: number; firstAt: number; blockedUntil: number }

const store = new Map<string, Entry>()

interface RateLimitConfig {
  maxAttempts: number
  windowMs: number
  lockoutMs: number
}

const CONFIGS: Record<string, RateLimitConfig> = {
  login:          { maxAttempts: 5,  windowMs: 15 * 60_000, lockoutMs: 30 * 60_000 },
  changePassword: { maxAttempts: 5,  windowMs: 15 * 60_000, lockoutMs: 60 * 60_000 },
  contact:        { maxAttempts: 10, windowMs: 60 * 60_000, lockoutMs: 60 * 60_000 },
  publicApi:      { maxAttempts: 60, windowMs:       60_000, lockoutMs:  5 * 60_000 },
}

// Purge entries older than 2 hours to prevent memory leaks
let lastPurge = Date.now()
function maybePurge() {
  const now = Date.now()
  if (now - lastPurge < 10 * 60_000) return
  lastPurge = now
  for (const [k, v] of store) {
    if (now - v.firstAt > 2 * 60 * 60_000 && v.blockedUntil < now) store.delete(k)
  }
}

export function checkRateLimit(
  ip: string,
  type: keyof typeof CONFIGS = 'login'
): { allowed: boolean; retryAfterSecs: number } {
  maybePurge()
  const cfg = CONFIGS[type]
  const key = `${type}:${ip}`
  const now = Date.now()
  const entry = store.get(key)

  if (entry) {
    if (entry.blockedUntil > now) {
      return { allowed: false, retryAfterSecs: Math.ceil((entry.blockedUntil - now) / 1000) }
    }
    if (now - entry.firstAt > cfg.windowMs) {
      store.delete(key)
    }
  }
  return { allowed: true, retryAfterSecs: 0 }
}

export function recordFailure(ip: string, type: keyof typeof CONFIGS = 'login'): void {
  const cfg = CONFIGS[type]
  const key = `${type}:${ip}`
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now - entry.firstAt > cfg.windowMs) {
    store.set(key, { count: 1, firstAt: now, blockedUntil: 0 })
    return
  }
  entry.count++
  if (entry.count >= cfg.maxAttempts) {
    entry.blockedUntil = now + cfg.lockoutMs
  }
  store.set(key, entry)
}

export function recordSuccess(ip: string, type: keyof typeof CONFIGS = 'login'): void {
  store.delete(`${type}:${ip}`)
}

export function getClientIp(req: { headers: { get(key: string): string | null } }): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1'
  )
}
