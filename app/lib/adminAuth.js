import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

/**
 * Validates admin credentials from request headers.
 * Returns { username, isSuperAdmin } or null if invalid.
 */
export async function validateAdmin(req) {
  const username = req.headers.get('x-admin-username')
  const password = req.headers.get('x-admin-password')

  if (!username || !password) return null

  // Superadmin is defined by env vars and cannot be managed through the UI
  if (
    username === process.env.SUPER_ADMIN_USERNAME &&
    password === process.env.SUPER_ADMIN_PASSWORD
  ) {
    return { username, isSuperAdmin: true }
  }

  // Regular admins are stored in Redis
  const users = await redis.get('admin_users') || []
  const user = users.find(u => u.username === username && u.password === password)
  if (!user) return null

  return { username: user.username, isSuperAdmin: false }
}

/**
 * Appends an entry to the audit log in Redis (capped at 500 entries).
 */
export async function logAction(username, action, detail = '') {
  const log = await redis.get('admin_audit_log') || []
  const entry = {
    username,
    action,
    detail,
    timestamp: new Date().toISOString(),
  }
  await redis.set('admin_audit_log', [entry, ...log].slice(0, 500))
}
