'use client'

import { useState, useMemo, useEffect } from 'react'
import initialProducts from '@/data/products.json'
import ProductCard from '@/components/ProductCard'
import { ProductGridSkeleton } from '@/components/Skeleton'
import { Search, SlidersHorizontal, X } from 'lucide-react'

export default function ProduitsPage() {
  const [search, setSearch]                   = useState('')
  const [selectedCat, setSelectedCat]         = useState('Tous')
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)
  const [products, setProducts]               = useState(initialProducts)
  const [categoryList, setCategoryList]       = useState([])
  const [loading, setLoading]                 = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(r => r.ok ? r.json() : null),
      fetch('/api/categories').then(r => r.ok ? r.json() : null),
    ]).then(([prods, cats]) => {
      if (prods) setProducts(prods)
      if (cats)  setCategoryList(cats)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const categories = ['Tous', ...new Set([
    ...categoryList,
    ...products.map(p => p.category).filter(Boolean),
  ])]

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                            (p.description || '').toLowerCase().includes(search.toLowerCase())
      const matchesCat   = selectedCat === 'Tous' || p.category === selectedCat
      const matchesAvail = !showAvailableOnly || p.available
      return matchesSearch && matchesCat && matchesAvail
    })
  }, [products, search, selectedCat, showAvailableOnly])

  const availableCount = products.filter(p => p.available).length
  const hasActiveFilter = search !== '' || selectedCat !== 'Tous' || showAvailableOnly

  const clearFilters = () => {
    setSearch('')
    setSelectedCat('Tous')
    setShowAvailableOnly(false)
  }

  return (
    <div className="bg-white min-h-screen">

      {/* ── En-tête page ───────────────────────────────────────── */}
      <div className="relative bg-primary-900 text-white overflow-hidden" style={{ paddingTop: '3.5rem', paddingBottom: '3.5rem' }}>
        {/* Grille subtile */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(201,161,74,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,161,74,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }} />
        {/* Lueur or bas-gauche */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 50% 80% at 0% 100%, rgba(201,161,74,0.12) 0%, transparent 60%)'
        }} />
        {/* Dégradé bas */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/5 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <span className="section-label" style={{ color: 'rgba(201,161,74,0.85)' }}>Catalogue</span>
          <h1 className="font-serif font-semibold text-white mb-2 leading-tight"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}>
            Nos produits
          </h1>
          <p className="text-stone-400 text-sm">
            {availableCount} produit{availableCount !== 1 ? 's' : ''} disponible{availableCount !== 1 ? 's' : ''} en stock
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* ── Barre de filtres ──────────────────────────────────── */}
        <div className="rounded-2xl border p-4 mb-10"
             style={{ background: '#F9F5EE', borderColor: 'rgba(201,161,74,0.18)' }}>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            {/* Recherche */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Rechercher un produit..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Rechercher un produit"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-shadow"
                style={{ '--tw-ring-color': 'rgba(201,161,74,0.4)' }}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  aria-label="Effacer la recherche"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filtre dispo */}
            <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer select-none bg-white px-3.5 py-2.5 rounded-xl border border-stone-200 hover:border-primary-400/50 transition-colors">
              <input
                type="checkbox"
                checked={showAvailableOnly}
                onChange={e => setShowAvailableOnly(e.target.checked)}
                className="w-3.5 h-3.5 rounded"
                style={{ accentColor: '#C9A14A' }}
              />
              <SlidersHorizontal size={14} className="text-stone-400" />
              En stock uniquement
            </label>
          </div>

          {/* Catégories + clear */}
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrer par catégorie">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                aria-pressed={selectedCat === cat}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  selectedCat === cat
                    ? 'bg-primary-900 text-white shadow-sm'
                    : 'bg-white text-stone-500 border border-stone-200 hover:border-primary-400/50 hover:text-primary-700'
                }`}
              >
                {cat}
              </button>
            ))}

            {hasActiveFilter && (
              <button
                onClick={clearFilters}
                className="ml-auto flex items-center gap-1.5 text-xs text-stone-500 hover:text-primary-700 transition-colors font-medium"
              >
                <X size={12} />
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        {/* ── Résultats ─────────────────────────────────────────── */}
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : filtered.length > 0 ? (
          <>
            <p className="text-xs text-stone-400 mb-5 font-medium" aria-live="polite">
              {filtered.length} produit{filtered.length !== 1 ? 's' : ''}
              {selectedCat !== 'Tous' && ` dans "${selectedCat}"`}
              {search && ` pour "${search}"`}
            </p>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6"
              role="list"
              aria-label="Catalogue produits"
            >
              {filtered.map(product => (
                <div key={product.id} role="listitem">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-28" role="status" aria-live="polite">
            <p className="text-4xl mb-5 opacity-15" aria-hidden="true">—</p>
            <p className="font-serif text-2xl text-primary-800 mb-2">Aucun produit trouvé</p>
            <p className="text-sm text-stone-400 mb-6">Essayez un autre mot-clé ou une autre catégorie</p>
            {hasActiveFilter && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-800 font-medium transition-colors border-b border-primary-300 hover:border-primary-600 pb-0.5"
              >
                <X size={13} /> Réinitialiser les filtres
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
