import pool from './db'

export async function auditLog(
  userId: number | null,
  username: string,
  action: string,
  detail: string,
  ip: string
): Promise<void> {
  try {
    await pool.execute(
      'INSERT INTO audit_log (user_id, username, action, detail, ip) VALUES (?, ?, ?, ?, ?)',
      [userId, username, action.slice(0, 100), detail.slice(0, 500), ip.slice(0, 64)]
    )
  } catch {
    // Audit failures must never break the main request
  }
}
