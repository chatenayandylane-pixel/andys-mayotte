'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, MapPin, Clock, CreditCard, ShoppingBag, Home, ArrowRight } from 'lucide-react'

export default function ConfirmationPage() {
  const [reservation, setReservation] = useState(null)

  useEffect(() => {
    try {
      const data = sessionStorage.getItem('andys-confirmation')
      if (data) {
        setReservation(JSON.parse(data))
        sessionStorage.removeItem('andys-confirmation')
      }
    } catch { /* ignore */ }
  }, [])

  const formatDate = dateStr => {
    if (!dateStr) return ''
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })
  }

  // ── Pas de données ──────────────────────────────────────────
  if (!reservation) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center mb-6">
          <ShoppingBag size={30} className="text-primary-300" />
        </div>
        <h1 className="font-serif text-3xl font-semibold text-primary-800 mb-3">Aucune réservation</h1>
        <p className="text-stone-500 mb-9 max-w-sm leading-relaxed">
          Passez d&apos;abord une commande depuis notre catalogue.
        </p>
        <Link
          href="/produits"
          className="inline-flex items-center gap-2 bg-primary-900 hover:bg-primary-800 active:scale-95 text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-forest"
        >
          <ShoppingBag size={17} />
          Voir les produits
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#F9F5EE' }}>

      {/* ── En-tête succès ────────────────────────────────────── */}
      <div className="bg-primary-900 text-white px-4 py-12 text-center relative overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(201,161,74,0.15) 0%, transparent 60%)'
        }} />
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 mb-4">
            <CheckCircle size={34} className="text-emerald-400" />
          </div>
          <h1 className="font-serif font-semibold text-white text-3xl md:text-4xl mb-2">
            Réservation confirmée !
          </h1>
          <p className="text-stone-400 text-sm">
            Votre commande a bien été enregistrée.
            {reservation.id && (
              <span className="block mt-1">
                Référence : <strong className="text-primary-400">#{reservation.id}</strong>
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">

        {/* ── Créneau de retrait ────────────────────────────────── */}
        <div className="bg-primary-900 text-white rounded-2xl p-6 relative overflow-hidden shadow-forest">
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse 65% 75% at 8% 92%, rgba(201,161,74,0.16) 0%, transparent 60%)'
          }} />
          <div className="relative z-10 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center shrink-0">
              <Clock size={18} className="text-primary-400" />
            </div>
            <div>
              <p className="text-stone-400 text-xs font-semibold tracking-widest uppercase mb-1">Créneau de retrait</p>
              <p className="font-serif text-white text-lg font-semibold capitalize">{formatDate(reservation.date)}</p>
              <p className="text-primary-400 font-bold text-2xl mt-0.5">{reservation.creneau}</p>
            </div>
          </div>
        </div>

        {/* ── Infos client ─────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-card border border-stone-100/80 p-6">
          <h2 className="font-serif font-semibold text-primary-800 text-lg mb-4">Vos informations</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-stone-400 text-[11px] uppercase tracking-widest mb-0.5">Nom</p>
              <p className="font-semibold text-primary-800">{reservation.prenom} {reservation.nom}</p>
            </div>
            <div>
              <p className="text-stone-400 text-[11px] uppercase tracking-widest mb-0.5">Téléphone</p>
              <p className="font-semibold text-primary-800">{reservation.telephone}</p>
            </div>
            <div className="col-span-2">
              <p className="text-stone-400 text-[11px] uppercase tracking-widest mb-0.5">Email</p>
              <p className="font-semibold text-primary-800">{reservation.email}</p>
            </div>
          </div>
        </div>

        {/* ── Détail commande ──────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-card border border-stone-100/80 p-6">
          <h2 className="font-serif font-semibold text-primary-800 text-lg mb-4">Détail de la commande</h2>
          <div className="space-y-3 mb-4">
            {reservation.articles.map(item => (
              <div key={item.id} className="flex items-center gap-3">
                <span className="text-xl shrink-0">{item.emoji || '📦'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary-800 leading-snug">{item.name}</p>
                  <p className="text-xs text-stone-400">{item.unit} × {item.quantity}</p>
                </div>
                <span className="font-semibold text-primary-800 text-sm shrink-0">
                  {(parseFloat(item.price) * item.quantity).toFixed(2)} €
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-stone-100 pt-4 flex justify-between items-center">
            <span className="font-semibold text-primary-800">Total indicatif</span>
            <span className="font-bold text-primary-500 text-xl">
              {parseFloat(reservation.totalIndicatif)?.toFixed(2)} €
            </span>
          </div>
          {reservation.note && (
            <div className="mt-4 bg-stone-50 rounded-xl p-3.5 text-sm text-stone-600 border border-stone-100">
              <p className="text-[10px] text-stone-400 font-semibold uppercase tracking-widest mb-1">Note</p>
              {reservation.note}
            </div>
          )}
        </div>

        {/* ── Infos pratiques ──────────────────────────────────── */}
        <div className="rounded-2xl p-6 border" style={{ background: '#F9F5EE', borderColor: 'rgba(201,161,74,0.25)' }}>
          <h2 className="font-semibold text-primary-800 mb-4 text-sm uppercase tracking-widest flex items-center gap-2">
            <span className="w-1 h-4 bg-primary-500 rounded-full" />
            À savoir pour le retrait
          </h2>
          <ul className="space-y-3.5">
            <li className="flex items-start gap-3 text-sm text-stone-700">
              <MapPin size={16} className="text-primary-500 shrink-0 mt-0.5" />
              <span>
                <strong>Où :</strong> Andy&apos;s — Grossiste alimentaire, Poroani, Mayotte (976)
              </span>
            </li>
            <li className="flex items-start gap-3 text-sm text-stone-700">
              <Clock size={16} className="text-primary-500 shrink-0 mt-0.5" />
              <span>
                <strong>Quand :</strong>{' '}
                <span className="capitalize">{formatDate(reservation.date)}</span>
                , créneau <strong>{reservation.creneau}</strong>
              </span>
            </li>
            <li className="flex items-start gap-3 text-sm text-stone-700">
              <CreditCard size={16} className="text-primary-500 shrink-0 mt-0.5" />
              <span>
                <strong>Paiement sur place</strong> au moment du retrait.
                Aucun paiement en ligne n&apos;est requis.
              </span>
            </li>
          </ul>
        </div>

        {/* ── Actions ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 pb-4">
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 bg-primary-900 hover:bg-primary-800 active:scale-95 text-white font-semibold py-3.5 rounded-xl transition-all shadow-forest"
          >
            <Home size={16} />
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/produits"
            className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-stone-50 active:scale-95 text-primary-800 font-semibold py-3.5 rounded-xl transition-all border border-stone-200 shadow-card"
          >
            <ShoppingBag size={16} />
            Nouvelle commande
          </Link>
        </div>
      </div>
    </div>
  )
}
