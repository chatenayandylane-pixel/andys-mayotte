import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { verifyAdminAuth } from '@/lib/auth'

export async function GET() {
  const rows = await sql`SELECT * FROM products ORDER BY id`
  return NextResponse.json(rows)
}

export async function PUT(request) {
  if (!(await verifyAdminAuth())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  try {
    const products = await request.json()
    if (!Array.isArray(products)) {
      return NextResponse.json({ error: 'Format invalide' }, { status: 400 })
    }
    await sql`DELETE FROM products`
    for (const p of products) {
      await sql`
        INSERT INTO products (id, name, description, price, unit, category, emoji, image, available, stock, featured, promo)
        VALUES (${BigInt(p.id)}, ${p.name}, ${p.description ?? ''}, ${p.price}, ${p.unit ?? ''}, ${p.category ?? ''},
                ${p.emoji ?? ''}, ${p.image ?? ''}, ${p.available ?? true}, ${p.stock ?? 0},
                ${p.featured ?? false}, ${p.promo ?? false})
      `
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
