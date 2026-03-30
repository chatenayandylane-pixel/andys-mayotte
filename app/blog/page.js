import Link from 'next/link'
import { sql } from '@/lib/db'
import { CalendarDays, ArrowRight, Newspaper } from 'lucide-react'

export const dynamic = 'force-dynamic'

function fmtDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function BlogPage() {
  const posts = await sql`SELECT * FROM posts WHERE published = true ORDER BY created_at DESC`.catch(() => [])

  return (
    <div className="min-h-screen bg-white">

      {/* ── Header ────────────────────────────────────────────── */}
      <div
        className="relative bg-primary-900 text-white overflow-hidden"
        style={{ paddingTop: '3.5rem', paddingBottom: '3.5rem' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(201,161,74,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,161,74,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 50% 80% at 0% 100%, rgba(201,161,74,0.12) 0%, transparent 60%)'
        }} />

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <span className="section-label" style={{ color: 'rgba(201,161,74,0.85)' }}>Actualités</span>
          <h1 className="font-serif font-semibold text-white mb-2 leading-tight"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}>
            Actualités &amp; Promos
          </h1>
          <p className="text-stone-400 text-sm">
            {posts.length} article{posts.length !== 1 ? 's' : ''} publié{posts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* ── Contenu ───────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">

        {posts.length === 0 ? (
          <div className="text-center py-28">
            <Newspaper size={48} className="mx-auto mb-5 text-stone-200" />
            <p className="font-serif text-2xl text-primary-800 mb-2">Aucun article pour le moment</p>
            <p className="text-stone-400 text-sm">Revenez bientôt, de nouvelles actualités arrivent !</p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-800 font-medium transition-colors border-b border-primary-300 hover:border-primary-600 pb-0.5"
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {posts.map((post, i) => (
              <article
                key={post.id}
                className={`reveal delay-${Math.min(i + 1, 5)} group bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-300 flex flex-col`}
              >
                {/* Image */}
                {post.image ? (
                  <div className="relative h-48 overflow-hidden bg-stone-100">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center"
                       style={{ background: 'linear-gradient(135deg, #F0F7F4 0%, #F7F2E8 100%)' }}>
                    <Newspaper size={40} className="text-stone-300" />
                  </div>
                )}

                {/* Contenu */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Date */}
                  <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-3">
                    <CalendarDays size={12} />
                    <time dateTime={post.created_at}>{fmtDate(post.created_at)}</time>
                  </div>

                  <h2 className="font-serif font-semibold text-primary-800 text-lg leading-snug mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {post.title}
                  </h2>

                  {post.excerpt && (
                    <p className="text-stone-500 text-sm leading-relaxed flex-1 mb-5 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-800 transition-colors group/link mt-auto"
                  >
                    Lire la suite
                    <ArrowRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
