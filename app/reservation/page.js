'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { CalendarCheck, ShoppingBag, ArrowLeft, Clock, User, Phone, Mail } from 'lucide-react'

// ─── Génération des créneaux horaires ────────────────────────────────────────
// Génère des créneaux de 30 min entre 8h00 et 17h30 (dernier créneau = 17h30–18h00)
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

// ─── Calcul de la date minimum de réservation ─────────────────────────────────
// On ne propose que les dates à partir d'aujourd'hui, lun–sam uniquement
function getMinDate() {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

// ─── Page Réservation ────────────────────────────────────────────────────────

export default function ReservationPage() {
  const { cart, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const timeSlots = useMemo(() => generateTimeSlots(), [])

  const [form, setForm] = useState({
    nom:        '',
    prenom:     '',
    telephone:  '',
    email:      '',
    date:       '',
    creneau:    '',
    note:       '',
  })

  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)

  // Mise à jour d'un champ du formulaire
  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Efface l'erreur dès que l'utilisateur commence à corriger
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  // Validation côté client
  const validate = () => {
    const newErrors = {}
    if (!form.nom.trim())       newErrors.nom       = 'Le nom est requis'
    if (!form.prenom.trim())    newErrors.prenom    = 'Le prénom est requis'
    if (!form.telephone.trim()) newErrors.telephone = 'Le téléphone est requis'
    else if (!/^(\+262|0262|0)[67]\d{7,8}$|^(\+33|0)[67]\d{8}$/.test(form.telephone.replace(/\s/g, '')))
                                newErrors.telephone = 'Format invalide (ex: +262 639 00 00 00 ou +33 6 00 00 00 00)'
    if (!form.email.trim())     newErrors.email     = 'L\'email est requis'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                newErrors.email     = 'Email invalide'
    if (!form.date)             newErrors.date      = 'Veuillez choisir une date'
    if (!form.creneau)          newErrors.creneau   = 'Veuillez choisir un créneau'
    if (cart.length === 0)      newErrors.cart      = 'Votre panier est vide'

    // Vérifie que la date choisie n'est pas un dimanche (getDay() === 0)
    if (form.date) {
      const d = new Date(form.date + 'T00:00:00')
      if (d.getDay() === 0) newErrors.date = 'Nous sommes fermés le dimanche'
    }

    return newErrors
  }

  // Soumission du formulaire
  const handleSubmit = async e => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      // Envoi de la réservation à l'API
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          articles: cart,
          totalIndicatif: totalPrice,
          createdAt: new Date().toISOString(),
        }),
      })

      if (!response.ok) throw new Error('Erreur serveur')

      const data = await response.json()

      // Stocke la confirmation pour l'afficher sur la page de confirmation
      sessionStorage.setItem('andys-confirmation', JSON.stringify({
        ...form,
        articles: cart,
        totalIndicatif: totalPrice,
        id: data.id,
      }))

      // Vide le panier
      clearCart()

      // Redirige vers la page de confirmation
      router.push('/confirmation')
    } catch (err) {
      setErrors({ submit: 'Une erreur est survenue. Veuillez réessayer.' })
    } finally {
      setLoading(false)
    }
  }

  // Si le panier est vide, on invite l'utilisateur à ajouter des produits
  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-6">🛒</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Votre panier est vide</h1>
        <p className="text-gray-500 mb-8">
          Ajoutez des produits à votre panier avant de réserver.
        </p>
        <Link
          href="/produits"
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium px-7 py-3.5 rounded-xl transition-colors"
        >
          <ShoppingBag size={18} />
          Voir les produits
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* En-tête */}
      <div className="mb-8">
        <Link
          href="/panier"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 mb-4 transition-colors"
        >
          <ArrowLeft size={15} />
          Retour au panier
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Réserver ma commande</h1>
        <p className="text-gray-500">Remplissez vos informations pour confirmer votre retrait</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Formulaire ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Informations personnelles */}
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-5">
                <User size={20} className="text-primary-600" />
                <h2 className="font-semibold text-gray-800">Informations personnelles</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Nom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nom <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={form.nom}
                    onChange={handleChange}
                    placeholder="Votre nom"
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.nom ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                  />
                  {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
                </div>

                {/* Prénom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Prénom <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={form.prenom}
                    onChange={handleChange}
                    placeholder="Votre prénom"
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.prenom ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                  />
                  {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom}</p>}
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <Phone size={13} className="inline mr-1" />
                    Téléphone <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={form.telephone}
                    onChange={handleChange}
                    placeholder="+262 6XX XX XX XX"
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.telephone ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                  />
                  {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <Mail size={13} className="inline mr-1" />
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>

            {/* Date et créneau */}
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Clock size={20} className="text-primary-600" />
                <h2 className="font-semibold text-gray-800">Date & créneau de retrait</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Date de retrait <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    min={getMinDate()}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.date ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                  />
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                  <p className="text-xs text-gray-400 mt-1">Lundi au samedi uniquement</p>
                </div>

                {/* Créneau */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Créneau horaire <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="creneau"
                    value={form.creneau}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white ${errors.creneau ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Note ou message (optionnel)
                </label>
                <textarea
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Instructions particulières, commentaires sur votre commande..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* ── Récapitulatif commande ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <CalendarCheck size={20} className="text-primary-600" />
                <h2 className="font-semibold text-gray-800">Votre commande</h2>
              </div>

              <div className="space-y-2 mb-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate mr-2">
                      {item.emoji} {item.name} ×{item.quantity}
                    </span>
                    <span className="font-medium shrink-0">
                      {(parseFloat(item.price) * item.quantity).toFixed(2)} €
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 mb-5">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-800">Total indicatif</span>
                  <span className="font-extrabold text-primary-600">
                    {totalPrice.toFixed(2)} €
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Paiement sur place</p>
              </div>

              {/* Rappel info */}
              <div className="bg-primary-50 rounded-xl p-3 mb-5 text-xs text-primary-700">
                📍 Retrait chez Andy's, Poroani, Mayotte<br />
                💵 Paiement au moment du retrait
              </div>

              {/* Erreur globale */}
              {errors.submit && (
                <p className="text-red-500 text-sm mb-3 bg-red-50 px-3 py-2 rounded-xl">
                  {errors.submit}
                </p>
              )}
              {errors.cart && (
                <p className="text-red-500 text-sm mb-3 bg-red-50 px-3 py-2 rounded-xl">
                  {errors.cart}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors shadow-md"
              >
                {loading ? (
                  <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <CalendarCheck size={18} />
                    Confirmer la réservation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
