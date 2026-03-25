import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Le fichier doit être une image' }, { status: 400 })
    }

    const ext = file.name.split('.').pop().toLowerCase()
    const safeName = file.name
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .toLowerCase()
      .slice(0, 40)
    const filename = `${Date.now()}-${safeName}.${ext}`

    // Production (Vercel) : utilise Vercel Blob
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import('@vercel/blob')
      const blob = await put(`products/${filename}`, file, { access: 'public' })
      return NextResponse.json({ url: blob.url }, { status: 201 })
    }

    // Développement local : écrit dans public/images/
    const { writeFileSync } = await import('fs')
    const { join } = await import('path')
    const bytes = await file.arrayBuffer()
    writeFileSync(join(process.cwd(), 'public', 'images', filename), Buffer.from(bytes))
    return NextResponse.json({ url: `/images/${filename}` }, { status: 201 })

  } catch (err) {
    console.error('Erreur upload:', err)
    return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 })
  }
}
