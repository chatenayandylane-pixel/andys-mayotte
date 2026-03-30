import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST(request) {
  try {
    const { email } = await request.json()
    if (!email) return NextResponse.json({ error: 'Email requis' }, { status: 400 })

    const rows = await sql`
      SELECT
        id,
        date,
        creneau,
        articles,
        total_indicatif AS "total",
        status,
        created_at  AS "createdAt",
        invoice_id  AS "invoiceId"
      FROM reservations
      WHERE LOWER(email) = LOWER(${email})
      ORDER BY created_at DESC
      LIMIT 20
    `
    return NextResponse.json(rows)
  } catch (err) {
    console.error('POST /api/commandes:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
