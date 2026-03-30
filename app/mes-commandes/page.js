'use client'

import { useState } from 'react'
import { Search, Package, CalendarDays, Clock, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react'

function fmtDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function StatusBadge({ status }) {
  const map = {
    validee:    { label: 'Validée',    cls: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
    en_attente: { label: 'En attente', cls: 'bg-amber-50 text-amber-700 border border-amber-100' },
    annulee:    { label: 'Annulée',    cls: 'bg-red-50 text-red-600 border border-red-100' },
  }
  const s = map[status] ?? { label: status, cls: 'bg-stone-100 text-stone-500 border border-stone-200' }
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.cls}`}>
      {s.label}
    </span>
  )
}

function CommandeCard({ commande }) {
  const [open, setOpen] = useState(false)
  const items = (() => {
    try { return JSON.parse(commande.items || commande.cart_items || '[]') } catch { return [] }
  })()
  const total = items.reduce((s, it) => s + (parseFloat(it.price || 0) * (it.quantity || 1)), 0)

  return (
    <div className="rounded-2xl border border-stone-100 bg-white shadow-card overflow-hidden">
      {/* En-tête */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-stone-50/60 transition-colors"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5">
          {/* Numéro */}
          <div className="flex items-center gap-2">
            <Package size={16} className="text-primary-500 shrink-0" />
            <span className="font-semibold text-primary-800 text-sm">
              #{commande.id?.toString().padStart(5, '0')}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-1.5 text-xs text-stone-400">
            <CalendarDays size={12} />
            <span>{fmtDate(commande.created_at)}</span>
          </div>

          {/* Créneau */}
          {commande.slot && (
            <div className="flex items-center gap-1.5 text-xs text-stone-400">
              <Clock size={12} />
              <span>{commande.slot}</span>
            </div>
          )}

          <StatusBadge status={commande.status} />
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-4">
          {total > 0 && (
            <span className="text-primary-500 font-bold text-sm hidden sm:block">
              ~{total.toFixed(2)} €
            </span>
          )}
          {open ? <ChevronUp size={16} className="text-stone-400" /> : <ChevronDown size={16} className="text-stone-400" />}
        </div>
      </button>

      {/* Détail accordéon */}
      {open && (
        <div className="border-t border-stone-100 px-5 md:px-6 py-4" style={{ background: '#F9F5EE' }}>
          {items.length > 0 ? (
            <>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Articles</p>
              <ul className="space-y-2 mb-4">
                {items.map((item, i) => (
                  <li key={i} className="flex items-center justify-between text-sm">
                    <span className="text-stone-700">
                      {item.emoji && <span className="mr-1.5">{item.emoji}</span>}
                      {item.name}
                      <span className="text-stone-400 ml-1.5">× {item.quantity || 1}</span>
                    </span>
                    {item.price && (
                      <span className="text-stone-500 font-medium shrink-0 ml-4">
                        {(parseFloat(item.price) * (item.quantity || 1)).toFixed(2)} €
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              {total > 0 && (
                <div className="flex justify-between items-center pt-3 border-t border-stone-200">
                  <span className="text-xs text-stone-400 font-medium">Total indicatif</span>
                  <span className="font-bold text-primary-800 text-base">~{total.toFixed(2)} €</span>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-stone-400 italic">Détail des articles non disponible.</p>
          )}

          {commande.notes && (
            <p className="mt-3 text-xs text-stone-500 leading-relaxed">
              <span className="font-semibold">Note :</span> {commande.notes}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default function MesCommandesPage() {
  const [email, setEmail]         = useState('')
  const [commandes, setCommandes] = useState(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [searched, setSearched]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setError('')
    setLoading(true)
    setSearched(false)
    try {
      const res = await fetch('/api/commandes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      if (!res.ok) throw new Error('Erreur serveur')
      const data = await res.json()
      setCommandes(Array.isArray(data) ? data : (data.commandes ?? data.reservations ?? []))
      setSearched(true)
    } catch {
      setError('Une erreur est survenue. Vérifiez votre connexion et réessayez.')
    } finally {
      setLoading(false)
    }
  }

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

        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <span className="section-label" style={{ color: 'rgba(201,161,74,0.85)' }}>Espace client</span>
          <h1 className="font-serif font-semibold text-white mb-2 leading-tight"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}>
            Mes commandes
          </h1>
          <p className="text-stone-400 text-sm">
            Retrouvez toutes vos réservations passées avec votre adresse email.
          </p>
        </div>
      </div>

      {/* ── Formulaire ────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">

        <div className="rounded-2xl border p-6 md:p-8 mb-10" style={{ background: '#FDFAF5', borderColor: 'rgba(201,161,74,0.2)' }}>
          <h2 className="font-serif font-semibold text-primary-800 text-xl mb-1">
            Retrouvez vos commandes
          </h2>
          <p className="text-stone-500 text-sm mb-6 leading-relaxed">
            Entrez l&apos;adresse email utilisée lors de votre réservation.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-shadow"
                style={{ '--tw-ring-color': 'rgba(201,161,74,0.4)' }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 bg-primary-900 hover:bg-primary-800 active:scale-95 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Recherche…
                </span>
              ) : (
                <>
                  <Search size={15} />
                  Rechercher
                </>
              )}
            </button>
          </form>

          {error && (
            <p className="mt-3 text-red-500 text-sm">{error}</p>
          )}
        </div>

        {/* ── Résultats ─────────────────────────────────────────── */}
        {searched && commandes !== null && (
          <div>
            {commandes.length === 0 ? (
              <div className="text-center py-16 rounded-2xl border border-stone-100" style={{ background: '#F9F5EE' }}>
                <ShoppingBag size={40} className="mx-auto mb-4 text-stone-300" />
                <p className="font-serif text-xl text-primary-800 mb-2">Aucune commande trouvée</p>
                <p className="text-stone-400 text-sm">Aucune commande n&apos;a été trouvée pour <strong>{email}</strong>.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <p className="text-sm text-stone-500">
                    <span className="font-semibold text-primary-800">{commandes.length}</span> commande{commandes.length > 1 ? 's' : ''} trouvée{commandes.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="space-y-4">
                  {commandes.map(commande => (
                    <CommandeCard key={commande.id} commande={commande} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
