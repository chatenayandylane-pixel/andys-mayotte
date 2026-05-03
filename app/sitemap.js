import { sql } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

const base = 'https://chezandys.com'

export default async function sitemap() {
  const now = new Date()

  // Pages statiques principales
  const staticPages = [
    { url: base,                              changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/produits`,                changeFrequency: 'daily',   priority: 0.95 },
    { url: `${base}/reservation`,             changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/blog`,                    changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/cgv`,                     changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/mentions-legales`,        changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${base}/politique-confidentialite`, changeFrequency: 'yearly', priority: 0.2 },
  ].map(p => ({ ...p, lastModified: now }))

  // Produits dynamiques
  let productPages = []
  try {
    const products = await sql`SELECT id, updated_at FROM products WHERE available = true`
    productPages = (products || []).map(p => ({
      url: `${base}/produits/${p.id}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }))
  } catch (_) {}

  // Articles de blog dynamiques
  let blogPages = []
  try {
    const posts = await sql`SELECT slug, updated_at FROM posts WHERE published = true`
    blogPages = (posts || []).map(p => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : now,
      changeFrequency: 'monthly',
      priority: 0.6,
    }))
  } catch (_) {}

  return [...staticPages, ...productPages, ...blogPages]
}
