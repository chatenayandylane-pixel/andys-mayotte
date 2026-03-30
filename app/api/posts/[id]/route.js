import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { verifyAdminAuth } from '@/lib/auth'

export async function PUT(request, { params }) {
  try {
    const isAdmin = await verifyAdminAuth()
    if (!isAdmin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { id } = params
    const { title, slug, excerpt, content, image, published } = await request.json()

    const [row] = await sql`
      UPDATE posts SET
        title     = COALESCE(${title ?? null},     title),
        slug      = COALESCE(${slug ?? null},      slug),
        excerpt   = COALESCE(${excerpt ?? null},   excerpt),
        content   = COALESCE(${content ?? null},   content),
        image     = COALESCE(${image ?? null},     image),
        published = COALESCE(${published ?? null}, published),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, title, slug, excerpt, content, image, published,
                created_at AS "createdAt", updated_at AS "updatedAt"
    `
    if (!row) return NextResponse.json({ error: 'Post introuvable' }, { status: 404 })
    return NextResponse.json(row)
  } catch (err) {
    console.error('PUT /api/posts/[id]:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const isAdmin = await verifyAdminAuth()
    if (!isAdmin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { id } = params
    await sql`DELETE FROM posts WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/posts/[id]:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
