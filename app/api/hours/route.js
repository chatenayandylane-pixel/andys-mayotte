import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { verifyAdminAuth } from '@/lib/auth'

const DAY_ORDER = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']
const TIME_RE   = /^\d{2}:\d{2}$/

export async function GET() {
  const rows = await sql`SELECT day, open, open_time AS "openTime", close_time AS "closeTime" FROM hours`
  rows.sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day))
  return NextResponse.json(rows)
}

export async function PUT(request) {
  if (!(await verifyAdminAuth())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  try {
    const hours = await request.json()
    if (!Array.isArray(hours)) {
      return NextResponse.json({ error: 'Format invalide' }, { status: 400 })
    }
    for (const h of hours) {
      if (!DAY_ORDER.includes(h.day)) continue
      if (h.openTime && !TIME_RE.test(h.openTime)) continue
      if (h.closeTime && !TIME_RE.test(h.closeTime)) continue
      await sql`
        INSERT INTO hours (day, open, open_time, close_time)
        VALUES (${h.day}, ${!!h.open}, ${h.openTime || '08:00'}, ${h.closeTime || '18:00'})
        ON CONFLICT (day) DO UPDATE SET open = ${!!h.open}, open_time = ${h.openTime || '08:00'}, close_time = ${h.closeTime || '18:00'}
      `
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
