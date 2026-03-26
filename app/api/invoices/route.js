import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function DELETE(request) {
  try {
    const { id } = await request.json()
    await sql`DELETE FROM invoices WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Erreur suppression facture:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function GET() {
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
}
