import { NextResponse } from 'next/server'
import crypto from 'crypto'

const ADMIN_SECRET    = process.env.ADMIN_SECRET    || 'dev-secret-insecure'
const SESSION_MAX_AGE = 8 * 60 * 60 * 1000

function isValidToken(token) {
  try {
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

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Protéger la page /admin (pas les routes API /api/admin/login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/api/')) {
    const token = request.cookies.get('admin_session')?.value
    if (!isValidToken(token)) {
      const loginUrl = new URL('/', request.url)
      loginUrl.searchParams.set('admin', '1')
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
