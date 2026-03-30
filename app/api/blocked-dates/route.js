import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { verifyAdminAuth } from '@/lib/auth'

export async function GET() {
  try {
    const rows = await sql`
      SELECT id, date, reason
      FROM blocked_dates
      ORDER BY date ASC
    `
    return NextResponse.json(rows)
  } catch (err) {
    console.error('GET /api/blocked-dates:', err)
    return NextResponse.json([])
  }
}

export async function POST(request) {
  try {
    const isAdmin = await verifyAdminAuth()
    if (!isAdmin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { date, reason = '' } = await request.json()
    if (!date) return NextResponse.json({ error: 'Date manquante' }, { status: 400 })

    const [row] = await sql`
      INSERT INTO blocked_dates (date, reason)
      VALUES (${date}, ${reason})
      ON CONFLICT (date) DO UPDATE SET reason = ${reason}
      RETURNING id, date, reason
    `
    return NextResponse.json(row, { status: 201 })
  } catch (err) {
    console.error('POST /api/blocked-dates:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const isAdmin = await verifyAdminAuth()
    if (!isAdmin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 })

    await sql`DELETE FROM blocked_dates WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/blocked-dates:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
