import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all') === '1'
    const rows = all
      ? await sql`SELECT id, author, rating, comment, approved, created_at AS "createdAt" FROM reviews ORDER BY created_at DESC`
      : await sql`SELECT id, author, rating, comment, created_at AS "createdAt" FROM reviews WHERE approved = true ORDER BY created_at DESC`
    return NextResponse.json(rows)
  } catch (err) {
    console.error('GET /api/reviews:', err)
    return NextResponse.json([])
  }
}

export async function POST(request) {
  try {
    const { author, rating, comment } = await request.json()
    if (!author || !rating || !comment) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'La note doit être entre 1 et 5' }, { status: 400 })
    }

    const [row] = await sql`
      INSERT INTO reviews (author, rating, comment)
      VALUES (${author}, ${parseInt(rating)}, ${comment})
      RETURNING id, author, rating, comment, approved, created_at AS "createdAt"
    `
    return NextResponse.json(row, { status: 201 })
  } catch (err) {
    console.error('POST /api/reviews:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
