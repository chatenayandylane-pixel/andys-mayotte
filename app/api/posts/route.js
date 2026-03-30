import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { verifyAdminAuth } from '@/lib/auth'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all') === '1'
    const rows = all
      ? await sql`SELECT id, title, slug, excerpt, content, image, published, created_at AS "createdAt", updated_at AS "updatedAt" FROM posts ORDER BY created_at DESC`
      : await sql`SELECT id, title, slug, excerpt, content, image, published, created_at AS "createdAt", updated_at AS "updatedAt" FROM posts WHERE published = true ORDER BY created_at DESC`
    return NextResponse.json(rows)
  } catch (err) {
    console.error('GET /api/posts:', err)
    return NextResponse.json([])
  }
}

export async function POST(request) {
  try {
    const isAdmin = await verifyAdminAuth()
    if (!isAdmin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { title, slug, excerpt = '', content = '', image = '', published = false } = await request.json()
    if (!title || !slug) {
      return NextResponse.json({ error: 'title et slug sont obligatoires' }, { status: 400 })
    }

    const [row] = await sql`
      INSERT INTO posts (title, slug, excerpt, content, image, published)
      VALUES (${title}, ${slug}, ${excerpt}, ${content}, ${image}, ${published})
      RETURNING id, title, slug, excerpt, content, image, published,
                created_at AS "createdAt", updated_at AS "updatedAt"
    `
    return NextResponse.json(row, { status: 201 })
  } catch (err) {
    console.error('POST /api/posts:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
