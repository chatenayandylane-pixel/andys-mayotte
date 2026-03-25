import { NextResponse } from 'next/server'
import crypto from 'crypto'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const ADMIN_SECRET   = process.env.ADMIN_SECRET   || 'dev-secret-insecure'

function createToken() {
  const timestamp = Date.now().toString()
  const hmac = crypto.createHmac('sha256', ADMIN_SECRET).update(timestamp).digest('hex')
  return `${timestamp}.${hmac}`
}

export async function POST(request) {
  try {
    const { password } = await request.json()
    if (!password || password !== ADMIN_PASSWORD) {
      // Délai pour contrer le brute force
      await new Promise(r => setTimeout(r, 500))
      return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
    }
    const token    = createToken()
    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   60 * 60 * 8, // 8 heures
      path:     '/',
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
