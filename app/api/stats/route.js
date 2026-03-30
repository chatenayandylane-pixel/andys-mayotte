import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { verifyAdminAuth } from '@/lib/auth'

export async function GET() {
  try {
    const isAdmin = await verifyAdminAuth()
    if (!isAdmin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    // Totaux réservations
    const [counts] = await sql`
      SELECT
        COUNT(*)                                              AS "totalReservations",
        COUNT(*) FILTER (WHERE status = 'en_attente')        AS "pendingReservations",
        COUNT(*) FILTER (WHERE status = 'validee')           AS "validatedReservations",
        COALESCE(SUM(total_indicatif) FILTER (WHERE status = 'validee'), 0) AS "totalRevenue",
        COALESCE(SUM(total_indicatif) FILTER (
          WHERE status = 'validee'
          AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW())
        ), 0) AS "monthRevenue",
        COALESCE(AVG(total_indicatif), 0) AS "avgOrderValue"
      FROM reservations
    `

    // Top 5 produits (parse articles JSONB)
    const topProducts = await sql`
      SELECT
        art->>'name'  AS name,
        art->>'emoji' AS emoji,
        SUM((art->>'quantity')::numeric)::int AS count
      FROM reservations,
           jsonb_array_elements(articles) AS art
      GROUP BY art->>'name', art->>'emoji'
      ORDER BY count DESC
      LIMIT 5
    `

    // Réservations par jour sur 30 derniers jours
    const reservationsByDay = await sql`
      SELECT
        TO_CHAR(created_at::date, 'YYYY-MM-DD') AS day,
        COUNT(*)::int AS count
      FROM reservations
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY created_at::date
      ORDER BY created_at::date ASC
    `

    return NextResponse.json({
      totalReservations:    parseInt(counts.totalReservations),
      pendingReservations:  parseInt(counts.pendingReservations),
      validatedReservations: parseInt(counts.validatedReservations),
      totalRevenue:         parseFloat(counts.totalRevenue),
      monthRevenue:         parseFloat(counts.monthRevenue),
      avgOrderValue:        parseFloat(counts.avgOrderValue),
      topProducts,
      reservationsByDay,
    })
  } catch (err) {
    console.error('GET /api/stats:', err)
    return NextResponse.json([], { status: 200 })
  }
}
