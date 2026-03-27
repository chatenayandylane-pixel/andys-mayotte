import { cookies } from 'next/headers'
import crypto from 'crypto'

const ADMIN_SECRET    = process.env.ADMIN_SECRET    || 'dev-secret-insecure'
const SESSION_MAX_AGE = 8 * 60 * 60 * 1000 // 8 heures

export async function verifyAdminAuth() {
  try {
    const token = cookies().get('admin_session')?.value
    if (!token) return false

    const [timestamp, hmac] = token.split('.')
    if (!timestamp || !hmac) return false

    if (Date.now() - parseInt(timestamp) > SESSION_MAX_AGE) return false

    const expected = crypto
      .createHmac('sha256', ADMIN_SECRET)
      .update(timestamp)
      .digest('hex')

    return crypto.timingSafeEqual(
      Buffer.from(hmac, 'hex'),
      Buffer.from(expected, 'hex')
    )
  } catch {
    return false
  }
}
