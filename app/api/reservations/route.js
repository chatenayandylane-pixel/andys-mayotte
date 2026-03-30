import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { sendConfirmationEmail, sendAdminNotification } from '@/lib/mailer'

// ── Rate limiting simple (par IP, max 10 réservations/heure) ─────────────────
const rateLimitMap = new Map()
function checkRateLimit(ip) {
  const now      = Date.now()
  const windowMs = 60 * 60 * 1000
  const maxReqs  = 10
  const entry    = rateLimitMap.get(ip)
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }
  if (entry.count >= maxReqs) return false
  entry.count++
  return true
}

function validateDate(dateStr) {
  if (!dateStr) return 'Date manquante'
  const d = new Date(dateStr + 'T00:00:00')
  if (isNaN(d)) return 'Date invalide'
  if (d < new Date(new Date().toDateString())) return 'La date ne peut pas être dans le passé'
  if (d.getDay() === 0) return 'Fermé le dimanche'
  return null
}

export async function GET() {
  try {
    const rows = await sql`
      SELECT
        id, prenom, nom, telephone, email, date, creneau, articles,
        total_indicatif AS "totalIndicatif",
        status,
        created_at  AS "createdAt",
        validated_at AS "validatedAt",
        invoice_id   AS "invoiceId"
      FROM reservations
      ORDER BY created_at DESC
    `
    return NextResponse.json(rows)
  } catch (err) {
    console.error('GET /api/reservations:', err)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Trop de requêtes. Réessayez dans une heure.' }, { status: 429 })
    }

    const body = await request.json()

    if (!body.nom || !body.prenom || !body.telephone || !body.date || !body.creneau) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
    }
    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(body.email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }
    const dateError = validateDate(body.date)
    if (dateError) return NextResponse.json({ error: dateError }, { status: 400 })
    if (!body.articles || body.articles.length === 0) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 })
    }

    const reservationId = `AND-${Date.now()}`
    const year = new Date().getFullYear()
    const [{ count }] = await sql`SELECT COUNT(*) AS count FROM invoices`
    const seqNumber = String(parseInt(count) + 1).padStart(4, '0')
    const invoiceId = `FAC-${year}-${seqNumber}`

    await sql`
      INSERT INTO invoices (id, reservation_id, client_nom, client_prenom, client_email, client_telephone, articles, total, status, created_at)
      VALUES (${invoiceId}, ${reservationId}, ${body.nom}, ${body.prenom}, ${body.email}, ${body.telephone},
              ${JSON.stringify(body.articles)}, ${parseFloat(body.totalIndicatif) || 0}, 'en_attente', NOW())
    `
    await sql`
      INSERT INTO reservations (id, prenom, nom, telephone, email, date, creneau, articles, total_indicatif, status, created_at, invoice_id)
      VALUES (${reservationId}, ${body.prenom}, ${body.nom}, ${body.telephone}, ${body.email},
              ${body.date}, ${body.creneau}, ${JSON.stringify(body.articles)},
              ${parseFloat(body.totalIndicatif) || 0}, 'en_attente', NOW(), ${invoiceId})
    `

    if (body.email) {
      sendConfirmationEmail({
        to: body.email, clientName: `${body.prenom} ${body.nom}`,
        reservationId, invoiceId, date: body.date, creneau: body.creneau,
        articles: body.articles, total: parseFloat(body.totalIndicatif) || 0,
      }).catch(err => console.error('Erreur email confirmation:', err))
    }

    sendAdminNotification({
      reservationId, clientName: `${body.prenom} ${body.nom}`,
      date: body.date, creneau: body.creneau,
      articles: body.articles, total: parseFloat(body.totalIndicatif) || 0,
    }).catch(err => console.error('Erreur notif admin:', err))

    return NextResponse.json({ id: reservationId, invoiceId, success: true }, { status: 201 })
  } catch (err) {
    console.error('Erreur API réservation:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
