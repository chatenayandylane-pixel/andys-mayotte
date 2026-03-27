import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { sendInvoiceEmail } from '@/lib/mailer'
import { verifyAdminAuth } from '@/lib/auth'

// ── PATCH — Valider le paiement + déduire le stock ────────────────────────────
export async function PATCH(request, { params }) {
  if (!(await verifyAdminAuth())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  try {
    const { id } = params

    const rows = await sql`
      SELECT
        id, status, articles,
        invoice_id   AS "invoiceId",
        nom, prenom, email,
        date, creneau,
        total_indicatif AS "totalIndicatif"
      FROM reservations
      WHERE id = ${id}
    `
    const reservation = rows[0]

    if (!reservation) {
      return NextResponse.json({ error: 'Réservation introuvable' }, { status: 404 })
    }
    if (reservation.status === 'validee') {
      return NextResponse.json({ error: 'Réservation déjà validée' }, { status: 409 })
    }

    const articles = Array.isArray(reservation.articles)
      ? reservation.articles
      : JSON.parse(reservation.articles || '[]')

    for (const article of articles) {
      const qty = parseInt(article.quantity) || 0
      if (qty <= 0) continue
      await sql`
        UPDATE products
        SET
          stock     = GREATEST(0, stock - ${qty}),
          available = CASE WHEN (stock - ${qty}) <= 0 THEN false ELSE available END
        WHERE id = ${BigInt(article.id)}
      `
    }

    await sql`
      UPDATE reservations
      SET status = 'validee', validated_at = NOW()
      WHERE id = ${id}
    `

    if (reservation.invoiceId) {
      await sql`
        UPDATE invoices
        SET status = 'payee'
        WHERE id = ${reservation.invoiceId}
      `
    }

    if (reservation.email && reservation.invoiceId) {
      sendInvoiceEmail({
        to:              reservation.email,
        clientName:      `${reservation.prenom} ${reservation.nom}`,
        invoiceId:       reservation.invoiceId,
        reservationDate: reservation.date,
        creneau:         reservation.creneau,
        articles,
        total:           parseFloat(reservation.totalIndicatif) || 0,
      }).catch(err => console.error('Erreur email facture:', err))
    }

    return NextResponse.json({ success: true, stockUpdated: articles.length })
  } catch (err) {
    console.error('Erreur PATCH réservation:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// ── DELETE — Annuler une réservation ─────────────────────────────────────────
export async function DELETE(request, { params }) {
  if (!(await verifyAdminAuth())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  try {
    const { id } = params

    const rows = await sql`
      SELECT id, status, articles, invoice_id AS "invoiceId"
      FROM reservations
      WHERE id = ${id}
    `
    const reservation = rows[0]

    if (!reservation) {
      return NextResponse.json({ error: 'Réservation introuvable' }, { status: 404 })
    }

    if (reservation.status === 'validee') {
      const articles = Array.isArray(reservation.articles)
        ? reservation.articles
        : JSON.parse(reservation.articles || '[]')

      for (const article of articles) {
        const qty = parseInt(article.quantity) || 0
        if (qty <= 0) continue
        await sql`
          UPDATE products
          SET stock = stock + ${qty}, available = true
          WHERE id = ${BigInt(article.id)}
        `
      }
    }

    await sql`DELETE FROM reservations WHERE id = ${id}`
    if (reservation.invoiceId) {
      await sql`DELETE FROM invoices WHERE id = ${reservation.invoiceId}`
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Erreur DELETE réservation:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
