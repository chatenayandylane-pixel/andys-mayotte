import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Rate limiting simple
const rateLimitMap = new Map()
function checkRateLimit(ip) {
  const now = Date.now()
  const windowMs = 60 * 60 * 1000
  const maxReqs = 5
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }
  if (entry.count >= maxReqs) return false
  entry.count++
  return true
}

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || '587'),
    secure: parseInt(SMTP_PORT || '587') === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
}

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Trop de messages envoyés. Réessayez dans une heure.' }, { status: 429 })
    }

    const { nom, email, sujet, message } = await request.json()

    if (!nom?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Nom, email et message sont requis.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 })
    }
    if (message.length > 2000) {
      return NextResponse.json({ error: 'Message trop long (max 2000 caractères).' }, { status: 400 })
    }

    const to = process.env.CONTACT_EMAIL || process.env.SMTP_USER || 'contact@chezandys.com'
    const from = process.env.SMTP_FROM || "Andy's Mayotte <noreply@chezandys.com>"
    const subjectLine = `[Contact] ${sujet?.trim() || 'Nouveau message'} — ${nom.trim()}`

    const html = `<!DOCTYPE html><html><body style="margin:0;font-family:Arial,sans-serif;background:#f9fafb">
      <div style="max-width:560px;margin:32px auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
        <div style="background:#1c4532;padding:24px 32px">
          <h1 style="margin:0;color:white;font-size:20px">Nouveau message — Contact</h1>
          <p style="margin:6px 0 0;color:#6ee7b7;font-size:13px">Andy's Mayotte</p>
        </div>
        <div style="padding:28px 32px">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;width:90px">Nom</td><td style="padding:6px 0;font-size:14px;color:#111;font-weight:600">${nom.trim()}</td></tr>
            <tr><td style="padding:6px 0;font-size:13px;color:#6b7280">Email</td><td style="padding:6px 0;font-size:14px;color:#1c4532"><a href="mailto:${email}" style="color:#1c4532">${email}</a></td></tr>
            ${sujet ? `<tr><td style="padding:6px 0;font-size:13px;color:#6b7280">Sujet</td><td style="padding:6px 0;font-size:14px;color:#111">${sujet.trim()}</td></tr>` : ''}
          </table>
          <div style="margin-top:20px;padding:16px;background:#f9f5ee;border-radius:8px;border:1px solid rgba(201,161,74,0.2)">
            <p style="margin:0;font-size:14px;color:#374151;white-space:pre-wrap;line-height:1.6">${message.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
          </div>
        </div>
        <div style="padding:12px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center">
          <p style="margin:0;font-size:11px;color:#9ca3af">Andy's Mayotte — contact@chezandys.com</p>
        </div>
      </div>
    </body></html>`

    const transporter = getTransporter()
    if (!transporter) {
      console.log(`[EMAIL non configuré] Contact de ${nom} (${email}) : ${message}`)
      return NextResponse.json({ success: true, simulated: true })
    }

    await transporter.sendMail({ from, to, subject: subjectLine, replyTo: email, html })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('POST /api/contact:', err)
    return NextResponse.json({ error: 'Erreur serveur. Réessayez.' }, { status: 500 })
  }
}
