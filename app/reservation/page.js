'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { CalendarCheck, ShoppingBag, ArrowLeft, Clock, User, Phone, Mail, MapPin, CreditCard } from 'lucide-react'

// ─── Génération des créneaux horaires ─────────────────────────────────────────
function generateTimeSlots() {
  const slots = []
  for (let h = 8; h < 18; h++) {
    for (const m of [0, 30]) {
      const hh = String(h).padStart(2, '0')
      const mm = String(m).padStart(2, '0')
      const nextM = m === 30 ? 0 : 30
      const nextH = m === 30 ? h + 1 : h
      const nhh = String(nextH).padStart(2, '0')
      const nmm = String(nextM).padStart(2, '0')
      slots.push(`${hh}:${mm} – ${nhh}:${nmm}`)
    }
  }
  return slots
}

function getMinDate() {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

// ─── Classes communes des champs ─────────────────────────────────────────────
const fieldBase = 'w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-shadow bg-white'
const fieldNormal = `${fieldBase} border-stone-200 focus:ring-primary-500/40`
const fieldError  = `${fieldBase} border-red-300 bg-red-50 focus:ring-red-300/40`

export default function ReservationPage() {
  const { cart, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const timeSlots = useMemo(() => generateTimeSlots(), [])

  const [form, setForm] = useState({
    nom: '', prenom: '', telephone: '', email: '',
    date: '', creneau: '', note: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [blockedDates, setBlockedDates] = useState([])

  useEffect(() => {
    fetch('/api/blocked-dates').then(r => r.json()).then(d => setBlockedDates(Array.isArray(d) ? d.map(x => x.date) : [])).catch(() => {})
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.nom.trim())       newErrors.nom       = 'Le nom est requis'
    if (!form.prenom.trim())    newErrors.prenom    = 'Le prénom est requis'
    if (!form.telephone.trim()) newErrors.telephone = 'Le téléphone est requis'
    else if (!/^(\+262|0262|0)[67]\d{7,8}$|^(\+33|0)[67]\d{8}$/.test(form.telephone.replace(/\s/g, '')))
                                newErrors.telephone = 'Format invalide (ex: +262 639 00 00 00)'
    if (!form.email.trim())     newErrors.email     = "L'email est requis"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                newErrors.email     = 'Email invalide'
    if (!form.date)             newErrors.date      = 'Veuillez choisir une date'
    if (!form.creneau)          newErrors.creneau   = 'Veuillez choisir un créneau'
    if (cart.length === 0)      newErrors.cart      = 'Votre panier est vide'
    if (form.date) {
      const d = new Date(form.date + 'T00:00:00')
      if (d.getDay() === 0) newErrors.date = 'Nous sommes fermés le dimanche'
      if (blockedDates.includes(form.date)) newErrors.date = 'Cette date est indisponible (fermeture exceptionnelle)'
    }
    return newErrors
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }

    setLoading(true)
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form, articles: cart,
          totalIndicatif: totalPrice,
          createdAt: new Date().toISOString(),
        }),
      })
      if (!response.ok) throw new Error('Erreur serveur')
      const data = await response.json()

      sessionStorage.setItem('andys-confirmation', JSON.stringify({
        ...form, articles: cart,
        totalIndicatif: totalPrice,
        id: data.id,
      }))
      clearCart()
      router.push('/confirmation')
    } catch {
      setErrors({ submit: 'Une erreur est survenue. Veuillez réessayer.' })
    } finally {
      setLoading(false)
    }
  }

  // ── Panier vide ──────────────────────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center mb-6">
          <ShoppingBag size={30} className="text-primary-300" />
        </div>
        <h1 className="font-serif text-3xl font-semibold text-primary-800 mb-3">Panier vide</h1>
        <p className="text-stone-500 mb-9 max-w-sm leading-relaxed">
          Ajoutez des produits à votre panier avant de réserver.
        </p>
        <Link
          href="/produits"
          className="inline-flex items-center gap-2 bg-primary-900 hover:bg-primary-800 active:scale-95 text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-forest"
        >
          <ShoppingBag size={17} /> Voir les produits
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#F9F5EE' }}>

      {/* ── En-tête ─────────────────────────────────────────────── */}
      <div className="bg-primary-900 text-white px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/panier"
            className="inline-flex items-center gap-1.5 text-stone-400 hover:text-primary-400 text-sm mb-5 transition-colors"
          >
            <ArrowLeft size={14} /> Retour au panier
          </Link>
          <span className="section-label" style={{ color: 'rgba(201,161,74,0.85)' }}>Finalisation</span>
          <h1 className="font-serif font-semibold text-white leading-tight" style={{ fontSize: 'clamp(1.9rem, 4vw, 2.8rem)' }}>
            Réserver ma commande
          </h1>
          <p className="text-stone-400 text-sm mt-1">Remplissez vos informations pour confirmer votre retrait</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Formulaire ─────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Informations personnelles */}
              <div className="bg-white rounded-2xl shadow-card border border-stone-100/80 p-6">
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center">
                    <User size={15} className="text-primary-600" />
                  </div>
                  <h2 className="font-serif font-semibold text-primary-800 text-lg">Informations personnelles</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nom */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">
                      Nom <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text" name="nom" value={form.nom} onChange={handleChange}
                      placeholder="Votre nom"
                      className={errors.nom ? fieldError : fieldNormal}
                    />
                    {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
                  </div>

                  {/* Prénom */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">
                      Prénom <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text" name="prenom" value={form.prenom} onChange={handleChange}
                      placeholder="Votre prénom"
                      className={errors.prenom ? fieldError : fieldNormal}
                    />
                    {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom}</p>}
                  </div>

                  {/* Téléphone */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">
                      <Phone size={12} className="inline mr-1 opacity-60" />
                      Téléphone <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel" name="telephone" value={form.telephone} onChange={handleChange}
                      placeholder="+262 6XX XX XX XX"
                      className={errors.telephone ? fieldError : fieldNormal}
                    />
                    {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">
                      <Mail size={12} className="inline mr-1 opacity-60" />
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email" name="email" value={form.email} onChange={handleChange}
                      placeholder="votre@email.com"
                      className={errors.email ? fieldError : fieldNormal}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>
              </div>

              {/* Date & créneau */}
              <div className="bg-white rounded-2xl shadow-card border border-stone-100/80 p-6">
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center">
                    <Clock size={15} className="text-primary-600" />
                  </div>
                  <h2 className="font-serif font-semibold text-primary-800 text-lg">Date & créneau de retrait</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">
                      Date de retrait <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date" name="date" value={form.date}
                      min={getMinDate()} onChange={handleChange}
                      className={errors.date ? fieldError : fieldNormal}
                    />
                    {errors.date
                      ? <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                      : <p className="text-xs text-stone-400 mt-1">Lundi au samedi uniquement</p>
                    }
                  </div>

                  {/* Créneau */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">
                      Créneau horaire <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="creneau" value={form.creneau} onChange={handleChange}
                      className={errors.creneau ? fieldError : fieldNormal}
                    >
                      <option value="">Choisir un créneau...</option>
                      {timeSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                    {errors.creneau && <p className="text-red-500 text-xs mt-1">{errors.creneau}</p>}
                  </div>
                </div>

                {/* Note */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Note ou message <span className="text-stone-400 font-normal">(optionnel)</span>
                  </label>
                  <textarea
                    name="note" value={form.note} onChange={handleChange}
                    rows={3}
                    placeholder="Instructions particulières, commentaires sur votre commande..."
                    className={`${fieldNormal} resize-none`}
                  />
                </div>
              </div>
            </div>

            {/* ── Récapitulatif commande ──────────────────────────── */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-card border border-stone-100/80 p-5 sticky top-20">
                <h2 className="font-serif font-semibold text-primary-800 text-lg mb-5">Votre commande</h2>

                {/* Articles */}
                <div className="space-y-2 mb-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-stone-600 truncate mr-2">
                        {item.emoji} {item.name} ×{item.quantity}
                      </span>
                      <span className="font-medium text-primary-800 shrink-0">
                        {(parseFloat(item.price) * item.quantity).toFixed(2)} €
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-stone-100 pt-3.5 mb-5">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-primary-800 text-sm">Total indicatif</span>
                    <span className="font-bold text-primary-500 text-xl">{totalPrice.toFixed(2)} €</span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">Paiement sur place</p>
                </div>

                {/* Rappel */}
                <div className="rounded-xl p-3.5 mb-5 text-xs space-y-1.5 border"
                     style={{ background: '#F9F5EE', borderColor: 'rgba(201,161,74,0.18)' }}>
                  <div className="flex items-center gap-2 text-stone-600">
                    <MapPin size={12} className="text-primary-500 shrink-0" />
                    Retrait chez Andy&apos;s, Poroani, Mayotte
                  </div>
                  <div className="flex items-center gap-2 text-stone-600">
                    <CreditCard size={12} className="text-primary-500 shrink-0" />
                    Paiement au moment du retrait
                  </div>
                </div>

                {/* Erreurs globales */}
                {(errors.submit || errors.cart) && (
                  <p className="text-red-500 text-sm mb-3 bg-red-50 border border-red-100 px-3 py-2 rounded-xl">
                    {errors.submit || errors.cart}
                  </p>
                )}

                {/* CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-400 disabled:bg-stone-200 disabled:cursor-not-allowed active:scale-95 text-white font-semibold py-3.5 rounded-xl transition-all shadow-gold"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <><CalendarCheck size={17} /> Confirmer la réservation</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
