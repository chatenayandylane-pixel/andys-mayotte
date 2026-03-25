'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, MapPin, Clock, CreditCard, ShoppingBag, Home } from 'lucide-react'

// ─── Page Confirmation ────────────────────────────────────────────────────────
// Affiche le récapitulatif de la réservation après validation du formulaire

export default function ConfirmationPage() {
  const [reservation, setReservation] = useState(null)

  // Récupère les données de réservation depuis sessionStorage
  useEffect(() => {
    try {
      const data = sessionStorage.getItem('andys-confirmation')
      if (data) {
        setReservation(JSON.parse(data))
        // On nettoie après lecture pour éviter un affichage obsolète
        sessionStorage.removeItem('andys-confirmation')
      }
    } catch { /* ignore */ }
  }, [])

  // Formatage de la date en français
  const formatDate = dateStr => {
    if (!dateStr) return ''
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })
  }

  // Si pas de données (accès direct à la page)
  if (!reservation) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">📋</div>
        <h1 className="text-2xl font-bold text-primary-800 mb-3">Aucune réservation trouvée</h1>
        <p className="text-stone-500 mb-8">
          Passez d&apos;abord une commande depuis notre catalogue.
        </p>
        <Link
          href="/produits"
          className="inline-flex items-center gap-2 bg-primary-800 hover:bg-primary-700 text-white font-medium px-7 py-3.5 rounded-xl transition-colors"
        >
          <ShoppingBag size={18} />
          Voir les produits
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">

      {/* ── Bannière de succès ── */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-5">
          <CheckCircle size={42} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-primary-800 mb-2">Réservation confirmée !</h1>
        <p className="text-stone-500 text-lg">
          Votre commande a bien été enregistrée.
          {reservation.id && (
            <span className="block text-sm text-stone-400 mt-1">
              Référence : <strong className="text-stone-600">#{reservation.id}</strong>
            </span>
          )}
        </p>
      </div>

      {/* ── Informations client ── */}
      <div className="bg-white rounded-2xl shadow-card border border-stone-100 p-6 mb-5">
        <h2 className="font-semibold text-primary-800 mb-4">Vos informations</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-stone-400 text-xs mb-0.5">Nom</p>
            <p className="font-medium text-primary-800">{reservation.prenom} {reservation.nom}</p>
          </div>
          <div>
            <p className="text-stone-400 text-xs mb-0.5">Téléphone</p>
            <p className="font-medium text-primary-800">{reservation.telephone}</p>
          </div>
          <div className="col-span-2">
            <p className="text-stone-400 text-xs mb-0.5">Email</p>
            <p className="font-medium text-primary-800">{reservation.email}</p>
          </div>
        </div>
      </div>

      {/* ── Date et créneau ── */}
      <div className="bg-primary-900 text-white rounded-2xl p-6 mb-5 relative overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 70% 80% at 10% 90%, rgba(201,161,74,0.18) 0%, transparent 65%)'
        }} />
        <div className="relative z-10 flex items-start gap-4">
          <Clock size={28} className="text-primary-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-lg">Votre créneau de retrait</p>
            <p className="text-stone-300 mt-1 capitalize">{formatDate(reservation.date)}</p>
            <p className="text-primary-400 font-bold text-xl mt-1">{reservation.creneau}</p>
          </div>
        </div>
      </div>

      {/* ── Détail de la commande ── */}
      <div className="bg-white rounded-2xl shadow-card border border-stone-100 p-6 mb-5">
        <h2 className="font-semibold text-primary-800 mb-4">Détail de la commande</h2>
        <div className="space-y-3 mb-4">
          {reservation.articles.map(item => (
            <div key={item.id} className="flex items-center gap-3">
              <span className="text-2xl">{item.emoji}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-primary-800">{item.name}</p>
                <p className="text-xs text-stone-500">{item.unit} × {item.quantity}</p>
              </div>
              <span className="font-semibold text-primary-800 text-sm">
                {(parseFloat(item.price) * item.quantity).toFixed(2)} €
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-stone-100 pt-3 flex justify-between">
          <span className="font-semibold text-primary-800">Total indicatif</span>
          <span className="font-extrabold text-primary-600 text-lg">
            {parseFloat(reservation.totalIndicatif)?.toFixed(2)} €
          </span>
        </div>

        {reservation.note && (
          <div className="mt-4 bg-stone-50 rounded-xl p-3 text-sm text-stone-600 border border-stone-100">
            <p className="text-xs text-stone-400 font-medium mb-1">Note</p>
            {reservation.note}
          </div>
        )}
      </div>

      {/* ── Informations pratiques ── */}
      <div className="bg-accent-50 border border-accent-200 rounded-2xl p-6 mb-8">
        <h2 className="font-semibold text-accent-700 mb-4">📋 À savoir pour le retrait</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3 text-sm text-stone-700">
            <MapPin size={18} className="text-accent-500 shrink-0 mt-0.5" />
            <span>
              <strong>Où :</strong> Andy&apos;s — Grossiste alimentaire, Poroani, Mayotte (976)
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm text-stone-700">
            <Clock size={18} className="text-accent-500 shrink-0 mt-0.5" />
            <span>
              <strong>Quand :</strong> <span className="capitalize">{formatDate(reservation.date)}</span>
              , créneau <strong>{reservation.creneau}</strong>
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm text-stone-700">
            <CreditCard size={18} className="text-accent-500 shrink-0 mt-0.5" />
            <span>
              <strong>Paiement sur place</strong> au moment du retrait.
              Aucun paiement en ligne n&apos;est requis.
            </span>
          </li>
        </ul>
      </div>

      {/* ── Actions ── */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 bg-primary-800 hover:bg-primary-700 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors"
        >
          <Home size={18} />
          Retour à l&apos;accueil
        </Link>
        <Link
          href="/produits"
          className="flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium px-7 py-3.5 rounded-xl transition-colors"
        >
          <ShoppingBag size={18} />
          Nouvelle commande
        </Link>
      </div>
    </div>
  )
}
