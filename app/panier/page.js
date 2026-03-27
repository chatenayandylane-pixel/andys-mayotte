'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, ShoppingCart } from 'lucide-react'

export default function PanierPage() {
  const { cart, totalItems, totalPrice, removeItem, updateQty, clearCart } = useCart()

  // ── Panier vide ────────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center mb-6">
          <ShoppingCart size={32} className="text-primary-300" />
        </div>
        <h1 className="font-serif text-3xl font-semibold text-primary-800 mb-3">Panier vide</h1>
        <p className="text-stone-500 mb-9 max-w-sm leading-relaxed">
          Parcourez notre catalogue et ajoutez des produits à votre panier.
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
      {/* ── En-tête ───────────────────────────────────────────── */}
      <div className="bg-primary-900 text-white px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <span className="section-label" style={{ color: 'rgba(201,161,74,0.85)' }}>Ma commande</span>
          <div className="flex items-end justify-between">
            <h1 className="font-serif font-semibold text-white leading-tight" style={{ fontSize: 'clamp(1.9rem, 4vw, 2.8rem)' }}>
              Mon panier
            </h1>
            <span className="text-stone-400 text-sm mb-1">{totalItems} article{totalItems > 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Liste des articles ──────────────────────────────── */}
          <div className="lg:col-span-2 space-y-3">

            {cart.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-card border border-stone-100/80 p-4 flex items-center gap-4 transition-all hover:shadow-hover"
              >
                {/* Visuel produit */}
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0"
                     style={{ background: 'linear-gradient(135deg, #F0F7F4, #F7F2E8)' }}>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                    />
                  ) : null}
                  <span className={`text-3xl ${item.image ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
                    {item.emoji?.trim() || '📦'}
                  </span>
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-primary-800 text-sm leading-snug truncate">{item.name}</p>
                  <p className="text-[11px] text-stone-400 mt-0.5 uppercase tracking-wide">{item.unit}</p>
                  <p className="text-primary-500 font-bold mt-1 text-base">
                    {(parseFloat(item.price) * item.quantity).toFixed(2)} €
                  </p>
                </div>

                {/* Contrôle quantité */}
                <div className="flex items-center gap-1 bg-stone-50 rounded-xl p-1 shrink-0">
                  <button
                    onClick={() => updateQty(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-card hover:bg-red-50 hover:text-red-500 transition-colors border border-stone-200/80"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-8 text-center font-bold text-primary-800 text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-900 hover:bg-primary-800 text-white transition-colors"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                {/* Supprimer */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl text-stone-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}

            {/* Vider le panier */}
            <div className="flex justify-end pt-1">
              <button
                onClick={() => { if (window.confirm('Vider le panier ? Cette action est irréversible.')) clearCart() }}
                className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-red-500 transition-colors font-medium"
              >
                <Trash2 size={12} />
                Vider le panier
              </button>
            </div>
          </div>

          {/* ── Récapitulatif ────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-card border border-stone-100/80 p-5 sticky top-20">
              <h2 className="font-serif font-semibold text-primary-800 text-lg mb-5">Récapitulatif</h2>

              {/* Détail articles */}
              <div className="space-y-2 mb-5">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-stone-600 truncate mr-2">{item.name} ×{item.quantity}</span>
                    <span className="font-medium text-primary-800 shrink-0">
                      {(parseFloat(item.price) * item.quantity).toFixed(2)} €
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t border-stone-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-primary-800 text-sm">Total indicatif</span>
                  <span className="text-xl font-bold text-primary-500">
                    {totalPrice.toFixed(2)} €
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 mt-1.5 leading-relaxed">
                  Paiement sur place au moment du retrait
                </p>
              </div>

              {/* CTA principal */}
              <Link
                href="/reservation"
                className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-400 active:scale-95 text-white font-semibold py-3.5 rounded-xl transition-all shadow-gold mb-3"
              >
                Réserver ma commande
                <ArrowRight size={16} />
              </Link>

              {/* Continuer les achats */}
              <Link
                href="/produits"
                className="w-full flex items-center justify-center gap-2 text-sm text-stone-500 hover:text-primary-700 transition-colors py-2"
              >
                <ArrowLeft size={13} />
                Continuer mes achats
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
