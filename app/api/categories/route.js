import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { verifyAdminAuth } from '@/lib/auth'

export async function GET() {
  const rows = await sql`SELECT name FROM categories ORDER BY name`
  return NextResponse.json(rows.map(r => r.name))
}

export async function PUT(request) {
  if (!(await verifyAdminAuth())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  try {
    const categories = await request.json()
    if (!Array.isArray(categories)) {
      return NextResponse.json({ error: 'Format invalide' }, { status: 400 })
    }
    const validated = categories
      .filter(name => typeof name === 'string' && name.trim().length > 0 && name.length <= 100)
      .map(name => name.trim())
    if (validated.length === 0) {
      return NextResponse.json({ error: 'Aucune catégorie valide' }, { status: 400 })
    }
    await sql`DELETE FROM categories`
    for (const name of validated) {
      await sql`INSERT INTO categories (name) VALUES (${name})`
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
