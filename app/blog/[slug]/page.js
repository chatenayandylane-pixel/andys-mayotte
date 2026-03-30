import Link from 'next/link'
import { notFound } from 'next/navigation'
import { sql } from '@/lib/db'
import { ArrowLeft, CalendarDays } from 'lucide-react'

export const dynamic = 'force-dynamic'

function fmtDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function BlogPostPage({ params }) {
  const result = await sql`SELECT * FROM posts WHERE slug = ${params.slug} AND published = true`.catch(() => null)

  if (!result || result.length === 0) notFound()

  const post = Array.isArray(result) ? result[0] : result

  return (
    <div className="min-h-screen bg-white">

      {/* ── Image header ──────────────────────────────────────── */}
      {post.image ? (
        <div className="relative h-72 md:h-96 overflow-hidden bg-primary-900">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to bottom, rgba(10,38,24,0.45) 0%, rgba(10,38,24,0.80) 100%)'
          }} />

          {/* Bouton retour */}
          <div className="absolute top-6 left-0 right-0 max-w-3xl mx-auto px-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm group"
            >
              <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
              Retour aux actualités
            </Link>
          </div>

          {/* Titre sur image */}
          <div className="absolute bottom-0 left-0 right-0 max-w-3xl mx-auto px-4 pb-8">
            <div className="flex items-center gap-2 text-white/60 text-xs mb-3">
              <CalendarDays size={12} />
              <time dateTime={post.created_at}>{fmtDate(post.created_at)}</time>
            </div>
            <h1
              className="font-serif font-semibold text-white leading-tight"
              style={{ fontSize: 'clamp(1.6rem, 4vw, 2.8rem)' }}
            >
              {post.title}
            </h1>
          </div>
        </div>
      ) : (
        <div
          className="relative bg-primary-900 text-white overflow-hidden"
          style={{ paddingTop: '3.5rem', paddingBottom: '3rem' }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'linear-gradient(rgba(201,161,74,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,161,74,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }} />
          <div className="relative z-10 max-w-3xl mx-auto px-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-stone-400 hover:text-white transition-colors text-sm mb-5 group"
            >
              <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
              Retour aux actualités
            </Link>
            <div className="flex items-center gap-2 text-stone-400 text-xs mb-3">
              <CalendarDays size={12} />
              <time dateTime={post.created_at}>{fmtDate(post.created_at)}</time>
            </div>
            <h1
              className="font-serif font-semibold text-white leading-tight"
              style={{ fontSize: 'clamp(1.6rem, 4vw, 2.8rem)' }}
            >
              {post.title}
            </h1>
          </div>
        </div>
      )}

      {/* ── Contenu article ───────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">

        {/* Lien retour (si image header présente) */}
        {post.image && (
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-stone-400 hover:text-primary-700 transition-colors text-sm mb-8 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Retour aux actualités
          </Link>
        )}

        {/* Excerpt mis en avant */}
        {post.excerpt && (
          <p className="text-stone-600 text-base md:text-lg leading-relaxed mb-8 font-medium border-l-2 pl-4"
             style={{ borderColor: '#C9A14A' }}>
            {post.excerpt}
          </p>
        )}

        {/* Corps de l'article */}
        {post.content ? (
          <div
            className="prose prose-stone max-w-none text-stone-600 leading-relaxed"
            style={{
              fontSize: '1rem',
              lineHeight: '1.75',
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        ) : (
          <p className="text-stone-400 italic">Contenu à venir…</p>
        )}

        {/* Séparateur */}
        <div className="mt-12 pt-8 border-t border-stone-100 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-800 transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Toutes les actualités
          </Link>
          <Link
            href="/produits"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-800 transition-colors"
          >
            Voir le catalogue
          </Link>
        </div>
      </div>
    </div>
  )
}
