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
