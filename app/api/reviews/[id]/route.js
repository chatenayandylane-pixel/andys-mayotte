import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { verifyAdminAuth } from '@/lib/auth'

export async function PUT(request, { params }) {
  try {
    const isAdmin = await verifyAdminAuth()
    if (!isAdmin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { id } = params
    const { approved } = await request.json()
    if (typeof approved !== 'boolean') {
      return NextResponse.json({ error: 'Champ approved (boolean) requis' }, { status: 400 })
    }

    const [row] = await sql`
      UPDATE reviews SET approved = ${approved}
      WHERE id = ${id}
      RETURNING id, author, rating, comment, approved, created_at AS "createdAt"
    `
    if (!row) return NextResponse.json({ error: 'Avis introuvable' }, { status: 404 })
    return NextResponse.json(row)
  } catch (err) {
    console.error('PUT /api/reviews/[id]:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const isAdmin = await verifyAdminAuth()
    if (!isAdmin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { id } = params
    await sql`DELETE FROM reviews WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/reviews/[id]:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
