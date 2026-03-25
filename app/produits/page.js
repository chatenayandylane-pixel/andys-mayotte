'use client'

import { useState, useMemo, useEffect } from 'react'
import initialProducts from '@/data/products.json'
import ProductCard from '@/components/ProductCard'
import { Search, SlidersHorizontal } from 'lucide-react'

export default function ProduitsPage() {
  const [search, setSearch]                   = useState('')
  const [selectedCat, setSelectedCat]         = useState('Tous')
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)
  const [products, setProducts]               = useState(initialProducts)
  const [categoryList, setCategoryList]       = useState([])

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setProducts(data) })
      .catch(() => {})
    fetch('/api/categories')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setCategoryList(data) })
      .catch(() => {})
  }, [])

  // Catégories : celles définies en admin + celles présentes sur les produits (au cas où)
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

  return (
    <div className="bg-white min-h-screen">
      {/* ── En-tête page ── */}
      <div className="relative bg-primary-900 text-white py-14 overflow-hidden">
        {/* Grille subtile */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)',
          backgroundSize: '52px 52px'
        }} />
        {/* Lueur ambrée bas-gauche */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 55% 80% at 0% 100%, rgba(201,161,74,0.15) 0%, transparent 60%)'
        }} />
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <p className="text-primary-400 text-xs font-semibold tracking-widest uppercase mb-2">Catalogue</p>
          <h1 className="font-serif text-4xl font-semibold mb-2">Nos produits</h1>
          <p className="text-stone-400 text-sm">{availableCount} produits disponibles en stock</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* ── Filtres ── */}
        <div className="bg-primary-50 rounded-2xl border border-primary-100 p-4 mb-10">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            {/* Recherche */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            {/* Filtre dispo */}
            <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer select-none bg-white px-3 py-2 rounded-xl border border-stone-200 hover:border-primary-300 transition-colors">
              <input
                type="checkbox"
                checked={showAvailableOnly}
                onChange={e => setShowAvailableOnly(e.target.checked)}
                className="accent-primary-600 w-3.5 h-3.5"
              />
              <SlidersHorizontal size={14} className="text-stone-400" />
              En stock uniquement
            </label>
          </div>

          {/* Catégories */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  selectedCat === cat
                    ? 'bg-primary-800 text-white shadow-sm'
                    : 'bg-white text-stone-500 border border-stone-200 hover:border-primary-400 hover:text-primary-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Grille ── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-5xl mb-4 opacity-20">—</p>
            <p className="font-serif text-xl text-primary-800 mb-2">Aucun produit trouvé</p>
            <p className="text-sm text-stone-400">Essayez un autre mot-clé ou catégorie</p>
          </div>
        )}
      </div>
    </div>
  )
}
