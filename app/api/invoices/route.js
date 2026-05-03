import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { verifyAdminAuth } from '@/lib/auth'

export async function GET() {
  if (!(await verifyAdminAuth())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  try {
    const rows = await sql`
      SELECT
        id,
        reservation_id   AS "reservationId",
        client_nom       AS "clientNom",
        client_prenom    AS "clientPrenom",
        client_email     AS "clientEmail",
        client_telephone AS "clientTelephone",
        articles,
        total,
        status,
        created_at       AS "createdAt",
        paid_at          AS "paidAt"
      FROM invoices
      ORDER BY created_at DESC
    `
    return NextResponse.json(rows)
  } catch (err) {
    console.error('GET /api/invoices:', err)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request) {
  if (!(await verifyAdminAuth())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const {
      clientNom, clientPrenom, clientEmail, clientTelephone,
      articles, status, issuedAt, paidAt,
    } = body

    if (!clientNom || !clientPrenom) {
      return NextResponse.json({ error: 'Nom et prénom du client requis' }, { status: 400 })
    }
    if (!Array.isArray(articles) || articles.length === 0) {
      return NextResponse.json({ error: 'Au moins un article requis' }, { status: 400 })
    }

    const cleanArticles = articles
      .map(a => ({
        name:     String(a.name || '').trim(),
        quantity: parseInt(a.quantity) || 0,
        price:    parseFloat(a.price) || 0,
        emoji:    a.emoji ? String(a.emoji).trim() : '',
        unit:     a.unit  ? String(a.unit).trim()  : '',
      }))
      .filter(a => a.name && a.quantity > 0)

    if (cleanArticles.length === 0) {
      return NextResponse.json({ error: 'Articles invalides' }, { status: 400 })
    }

    const total = cleanArticles.reduce((s, a) => s + a.price * a.quantity, 0)

    const issuedDate = issuedAt ? new Date(issuedAt) : new Date()
    if (isNaN(issuedDate.getTime())) {
      return NextResponse.json({ error: 'Date d\'émission invalide' }, { status: 400 })
    }
    const year = issuedDate.getFullYear()

    const [{ count }] = await sql`SELECT COUNT(*) AS count FROM invoices`
    const seqNumber = String(parseInt(count) + 1).padStart(4, '0')
    const invoiceId = `FAC-${year}-${seqNumber}`

    const finalStatus = status === 'payee' ? 'payee' : 'en_attente'
    const finalPaidAt = finalStatus === 'payee' ? (paidAt || new Date().toISOString()) : null

    await sql`
      INSERT INTO invoices (
        id, reservation_id, client_nom, client_prenom, client_email,
        client_telephone, articles, total, status, created_at, paid_at
      )
      VALUES (
        ${invoiceId}, ${null}, ${clientNom}, ${clientPrenom}, ${clientEmail || null},
        ${clientTelephone || null}, ${JSON.stringify(cleanArticles)}, ${total},
        ${finalStatus}, ${issuedDate.toISOString()}, ${finalPaidAt}
      )
    `

    return NextResponse.json({ success: true, id: invoiceId })
  } catch (err) {
    console.error('POST /api/invoices:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request) {
  if (!(await verifyAdminAuth())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  try {
    const { id, issuedAt, paidAt } = await request.json()
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 })
    }

    const existing = await sql`SELECT id, status FROM invoices WHERE id = ${id}`
    if (!existing[0]) {
      return NextResponse.json({ error: 'Facture introuvable' }, { status: 404 })
    }

    if (issuedAt) {
      await sql`UPDATE invoices SET created_at = ${issuedAt} WHERE id = ${id}`
    }
    if (paidAt !== undefined) {
      // paidAt = null efface la date de paiement, sinon on la met à jour
      await sql`UPDATE invoices SET paid_at = ${paidAt} WHERE id = ${id}`
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('PATCH /api/invoices:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request) {
  if (!(await verifyAdminAuth())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  try {
    const { id } = await request.json()
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 })
    }
    await sql`DELETE FROM invoices WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Erreur suppression facture:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
