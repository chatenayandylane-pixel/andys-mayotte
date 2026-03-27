import { NextResponse } from 'next/server'
import { verifyAdminAuth } from '@/lib/auth'

const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

// Vérification des magic bytes (signature réelle du fichier)
function isValidImageBytes(buffer) {
  const b = new Uint8Array(buffer.slice(0, 12))
  const isPNG  = b[0]===0x89 && b[1]===0x50 && b[2]===0x4E && b[3]===0x47
  const isJPEG = b[0]===0xFF && b[1]===0xD8 && b[2]===0xFF
  const isWEBP = b[8]===0x57 && b[9]===0x45 && b[10]===0x42 && b[11]===0x50
  const isGIF  = b[0]===0x47 && b[1]===0x49 && b[2]===0x46
  return isPNG || isJPEG || isWEBP || isGIF
}

export async function POST(request) {
  if (!(await verifyAdminAuth())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Type de fichier non autorisé' }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Fichier trop volumineux (max 5 Mo)' }, { status: 413 })
    }

    const bytes = await file.arrayBuffer()

    if (!isValidImageBytes(bytes)) {
      return NextResponse.json({ error: 'Contenu du fichier invalide' }, { status: 400 })
    }

    const ext = file.name.split('.').pop().toLowerCase()
    const safeName = file.name
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .toLowerCase()
      .slice(0, 40)
    const filename = `${Date.now()}-${safeName}.${ext}`

    // Production : Vercel Blob
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import('@vercel/blob')
      const blob = await put(`products/${filename}`, file, { access: 'public' })
      return NextResponse.json({ url: blob.url }, { status: 201 })
    }

    // Développement local
    const { writeFileSync } = await import('fs')
    const { join } = await import('path')
    writeFileSync(join(process.cwd(), 'public', 'images', filename), Buffer.from(bytes))
    return NextResponse.json({ url: `/images/${filename}` }, { status: 201 })

  } catch (err) {
    console.error('Erreur upload:', err)
    return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 })
  }
}
