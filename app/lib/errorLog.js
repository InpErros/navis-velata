import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export async function logError(type, message, details = '') {
  try {
    const log = await redis.get('error_log') || []
    const entry = {
      id: Date.now().toString(),
      type,
      message,
      details: String(details),
      timestamp: new Date().toISOString(),
    }
    await redis.set('error_log', [entry, ...log].slice(0, 200)) // keep last 200
  } catch {
    // Don't let error logging break anything
  }
}
