'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react'

// ─── Page Panier ─────────────────────────────────────────────────────────────

export default function PanierPage() {
  const { cart, totalItems, totalPrice, removeItem, updateQty, clearCart } = useCart()

  // Panier vide
  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-6">🛒</div>
        <h1 className="text-2xl font-bold text-primary-800 mb-3">Votre panier est vide</h1>
        <p className="text-stone-500 mb-8">
          Parcourez notre catalogue et ajoutez des produits à votre panier.
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-800">Mon panier</h1>
          <p className="text-stone-500 mt-1">{totalItems} article{totalItems > 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => { if (window.confirm('Vider le panier ? Cette action est irréversible.')) clearCart() }}
          className="text-sm text-red-400 hover:text-red-600 hover:underline transition-colors flex items-center gap-1"
        >
          <Trash2 size={14} />
          Vider le panier
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Liste des articles ── */}
        <div className="lg:col-span-2 space-y-3">
          {cart.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-card border border-stone-100 p-4 flex items-center gap-4"
            >
              {/* Emoji produit */}
              <div className="w-16 h-16 bg-gradient-to-br from-primary-50 to-stone-100 rounded-xl flex items-center justify-center text-3xl shrink-0">
                {item.emoji}
              </div>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-primary-800 text-sm leading-snug truncate">
                  {item.name}
                </p>
                <p className="text-xs text-stone-500 mt-0.5">{item.unit}</p>
                <p className="text-primary-600 font-bold mt-1">
                  {(item.price * item.quantity).toFixed(2)} €
                </p>
              </div>

              {/* Contrôle quantité */}
              <div className="flex items-center gap-1 bg-stone-50 rounded-xl p-1 shrink-0">
                <button
                  onClick={() => updateQty(item.id, item.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-red-50 hover:text-red-500 transition-colors border border-stone-200"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-bold text-primary-800 text-sm">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQty(item.id, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors shadow-sm"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Supprimer */}
              <button
                onClick={() => removeItem(item.id)}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* ── Récapitulatif ── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-card border border-stone-100 p-5 sticky top-24">
            <h2 className="font-bold text-primary-800 mb-4">Récapitulatif</h2>

            {/* Détail des articles */}
            <div className="space-y-2 mb-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-stone-600 truncate mr-2">
                    {item.name} ×{item.quantity}
                  </span>
                  <span className="font-medium text-primary-800 shrink-0">
                    {(item.price * item.quantity).toFixed(2)} €
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-100 pt-4 mb-5">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-primary-800">Total indicatif</span>
                <span className="text-xl font-extrabold text-primary-600">
                  {totalPrice.toFixed(2)} €
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-1">
                Paiement sur place au moment du retrait
              </p>
            </div>

            {/* Bouton réservation */}
            <Link
              href="/reservation"
              className="w-full flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-md"
            >
              Réserver ma commande
              <ArrowRight size={18} />
            </Link>

            {/* Continuer les achats */}
            <Link
              href="/produits"
              className="w-full flex items-center justify-center gap-2 mt-3 text-sm text-stone-500 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft size={14} />
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
