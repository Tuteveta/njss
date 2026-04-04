// Shared validation helpers used across API routes

// Allowed settings keys — whitelist prevents arbitrary key injection
export const ALLOWED_SETTINGS_KEYS = new Set([
  'site_name', 'site_tagline',
  'contact_phone', 'contact_email', 'contact_address', 'contact_hours',
  'banner_enabled', 'banner_text', 'banner_link',
  'home_show_stats', 'home_show_services', 'home_show_process',
  'home_show_news', 'home_show_events', 'home_show_cta',
  'stat_cases', 'stat_judgments', 'stat_provinces', 'stat_officers',
])

// Allowed MIME types for image uploads
export const ALLOWED_IMAGE_MIMES = new Set([
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
])

// Allowed MIME types for document uploads
export const ALLOWED_DOCUMENT_MIMES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
])

export const MAX_IMAGE_BYTES    = 5  * 1024 * 1024  // 5 MB
export const MAX_DOCUMENT_BYTES = 20 * 1024 * 1024  // 20 MB

// Password complexity: min 8 chars, at least one uppercase, one lowercase, one digit, one symbol
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,128}$/

export function validatePassword(password: unknown): string | null {
  if (typeof password !== 'string') return 'Password is required'
  if (!PASSWORD_RE.test(password)) {
    return 'Password must be 8–128 characters and include uppercase, lowercase, a number, and a special character'
  }
  return null
}

export function validateUsername(username: unknown): string | null {
  if (typeof username !== 'string' || username.trim().length < 3) {
    return 'Username must be at least 3 characters'
  }
  if (!/^[a-zA-Z0-9_.-]{3,50}$/.test(username.trim())) {
    return 'Username may only contain letters, numbers, underscores, hyphens and dots (3–50 chars)'
  }
  return null
}
