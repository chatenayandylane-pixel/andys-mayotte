import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const ADMIN_SECRET    = process.env.ADMIN_SECRET    || 'dev-secret-insecure'
const SESSION_MAX_AGE = 8 * 60 * 60 * 1000 // 8 heures

export async function GET() {
  try {
    const token = cookies().get('admin_session')?.value
    if (!token) return NextResponse.json({ valid: false }, { status: 401 })

    const [timestamp, hmac] = token.split('.')
    if (!timestamp || !hmac) return NextResponse.json({ valid: false }, { status: 401 })

    // Vérifier expiration
    if (Date.now() - parseInt(timestamp) > SESSION_MAX_AGE) {
      return NextResponse.json({ valid: false, expired: true }, { status: 401 })
    }

    // Vérifier signature (timing-safe pour éviter les timing attacks)
    const expected = crypto.createHmac('sha256', ADMIN_SECRET).update(timestamp).digest('hex')
    const match    = crypto.timingSafeEqual(Buffer.from(hmac, 'hex'), Buffer.from(expected, 'hex'))
    if (!match) return NextResponse.json({ valid: false }, { status: 401 })

    return NextResponse.json({ valid: true })
  } catch {
    return NextResponse.json({ valid: false }, { status: 401 })
  }
}
