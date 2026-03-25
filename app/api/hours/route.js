import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

const DAY_ORDER = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']

export async function GET() {
  const rows = await sql`SELECT day, open, open_time AS "openTime", close_time AS "closeTime" FROM hours`
  // Trier dans l'ordre de la semaine
  rows.sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day))
  return NextResponse.json(rows)
}

export async function PUT(request) {
  try {
    const hours = await request.json()
    for (const h of hours) {
      await sql`
        INSERT INTO hours (day, open, open_time, close_time)
        VALUES (${h.day}, ${h.open}, ${h.openTime}, ${h.closeTime})
        ON CONFLICT (day) DO UPDATE SET open = ${h.open}, open_time = ${h.openTime}, close_time = ${h.closeTime}
      `
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
