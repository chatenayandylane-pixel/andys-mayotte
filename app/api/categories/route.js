import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  const rows = await sql`SELECT name FROM categories ORDER BY name`
  return NextResponse.json(rows.map(r => r.name))
}

export async function PUT(request) {
  try {
    const categories = await request.json()
    await sql`DELETE FROM categories`
    for (const name of categories) {
      await sql`INSERT INTO categories (name) VALUES (${name})`
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
