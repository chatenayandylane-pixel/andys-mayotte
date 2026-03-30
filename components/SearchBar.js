'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'

export default function SearchBar({ onClose }) {
  const [query, setQuery]           = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [open, setOpen]             = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef(null)
  const inputRef     = useRef(null)
  const router       = useRouter()

  // Charger les produits une seule fois
  useEffect(() => {
    fetch('/api/products')
      .then(r => r.ok ? r.json() : [])
      .then(data => setAllProducts(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  // Filtrer au fil de la frappe
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([])
      setOpen(false)
      setActiveIndex(-1)
      return
    }
    const q = query.toLowerCase()
    const results = allProducts
      .filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
      )
      .slice(0, 6)
    setSuggestions(results)
    setOpen(results.length > 0)
    setActiveIndex(-1)
  }, [query, allProducts])

  // Fermer si clic extérieur
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const navigate = useCallback((name) => {
    router.push(`/produits?q=${encodeURIComponent(name)}`)
    setQuery('')
    setOpen(false)
    onClose?.()
  }, [router, onClose])

  const handleKeyDown = (e) => {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        navigate(suggestions[activeIndex].name)
      } else if (query.trim()) {
        navigate(query.trim())
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      onClose?.()
    }
  }

  return (
    <div ref={containerRef} className="relative w-full" role="combobox" aria-expanded={open} aria-haspopup="listbox">
      {/* Input */}
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder="Rechercher un produit..."
          aria-label="Rechercher un produit"
          aria-autocomplete="list"
          autoComplete="off"
          className="w-full pl-10 pr-8 py-2 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-stone-400 focus:outline-none focus:bg-white/15 focus:border-primary-400/60 transition-all"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false); inputRef.current?.focus() }}
            aria-label="Effacer"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white transition-colors"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Dropdown suggestions */}
      {open && (
        <ul
          role="listbox"
          aria-label="Suggestions de recherche"
          className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-card border border-stone-200 overflow-hidden z-50"
          style={{ boxShadow: '0 8px 32px rgba(10,38,24,0.14), 0 2px 8px rgba(0,0,0,0.08)' }}
        >
          {suggestions.map((product, i) => (
            <li
              key={product.id}
              role="option"
              aria-selected={i === activeIndex}
              onMouseDown={() => navigate(product.name)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors text-sm ${
                i === activeIndex
                  ? 'bg-primary-900/6 text-primary-800'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span className="text-xl leading-none w-7 text-center shrink-0" aria-hidden="true">
                {product.emoji?.trim() || '📦'}
              </span>
              <span className="flex-1 min-w-0">
                <span className="font-medium truncate block">{product.name}</span>
              </span>
              {product.category && (
                <span className="text-[11px] text-stone-400 font-medium shrink-0 bg-stone-100 px-2 py-0.5 rounded-full">
                  {product.category}
                </span>
              )}
            </li>
          ))}
          {query.trim() && (
            <li
              role="option"
              aria-selected={false}
              onMouseDown={() => navigate(query.trim())}
              className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors text-sm text-primary-600 hover:bg-primary-50/50 border-t border-stone-100 font-medium"
            >
              <Search size={14} className="shrink-0" />
              Voir tous les résultats pour &ldquo;{query}&rdquo;
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
