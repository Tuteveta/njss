export const ROLES = ['superadmin', 'editor', 'viewer'] as const
export type Role = typeof ROLES[number]

export const ROLE_LABELS: Record<Role, string> = {
  superadmin: 'Super Admin',
  editor:     'Editor',
  viewer:     'Viewer',
}

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  superadmin: 'Full access — content, settings, users, and audit log',
  editor:     'Manage all content sections; no access to system settings or users',
  viewer:     'Read-only access to dashboard and messages',
}

export const ROLE_COLORS: Record<Role, string> = {
  superadmin: 'bg-red-100 text-red-700',
  editor:     'bg-blue-100 text-blue-700',
  viewer:     'bg-gray-100 text-gray-600',
}

// Which nav hrefs each role may visit. '*' means everything.
const ROLE_NAV: Record<Role, string[]> = {
  superadmin: ['*'],
  editor: [
    '/admin',
    '/admin/news',
    '/admin/events',
    '/admin/hero-slides',
    '/admin/services',
    '/admin/faqs',
    '/admin/about',
    '/admin/leadership',
    '/admin/offices',
    '/admin/pages',
    '/admin/media',
    '/admin/documents',
    '/admin/menus',
    '/admin/messages',
  ],
  viewer: ['/admin', '/admin/messages'],
}

export function canAccess(role: string, href: string): boolean {
  const allowed = ROLE_NAV[role as Role] ?? []
  if (allowed.includes('*')) return true
  return allowed.some(p => href === p || href.startsWith(p + '/'))
}

// API-level permission checks
export function canWrite(role: string): boolean {
  return role === 'superadmin' || role === 'editor'
}

export function isSuperAdmin(role: string): boolean {
  return role === 'superadmin'
}
