import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { sendInvoiceEmail } from '@/lib/mailer'

export async function PATCH(request, { params }) {
  try {
    const { id } = params

    const [reservation] = await sql`
      SELECT id, prenom, nom, email, date, creneau, articles, total_indicatif AS "totalIndicatif",
             status, invoice_id AS "invoiceId"
      FROM reservations WHERE id = ${id}
    `
    if (!reservation) return NextResponse.json({ error: 'Réservation introuvable' }, { status: 404 })
    if (reservation.status === 'validee') return NextResponse.json({ error: 'Déjà validée' }, { status: 400 })

    const now = new Date()

    // 1. Marquer la réservation comme validée
    await sql`UPDATE reservations SET status = 'validee', validated_at = ${now} WHERE id = ${id}`

    // 2. Marquer la facture comme payée
    await sql`UPDATE invoices SET status = 'payee', paid_at = ${now} WHERE id = ${reservation.invoiceId}`

    // 3. Décrémenter le stock
    const articles = reservation.articles || []
    for (const article of articles) {
      await sql`
        UPDATE products
        SET stock     = GREATEST(0, stock - ${article.quantity}),
            available = CASE WHEN GREATEST(0, stock - ${article.quantity}) = 0 THEN false ELSE available END
        WHERE id = ${article.id}
      `
    }

    // 4. Récupérer la facture pour l'email
    const [invoice] = await sql`SELECT total FROM invoices WHERE id = ${reservation.invoiceId}`

    // 5. Email de facture
    if (reservation.email) {
      await sendInvoiceEmail({
        to:              reservation.email,
        clientName:      `${reservation.prenom} ${reservation.nom}`,
        invoiceId:       reservation.invoiceId,
        reservationDate: reservation.date,
        creneau:         reservation.creneau,
        articles,
        total:           invoice ? parseFloat(invoice.total) : parseFloat(reservation.totalIndicatif || 0),
      }).catch(err => console.error('Erreur envoi email:', err))
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Erreur validation paiement:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
