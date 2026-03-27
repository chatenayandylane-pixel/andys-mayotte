'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react'

export default function ProductCard({ product }) {
  const { cart, addItem, updateQty } = useCart()
  const [added, setAdded]       = useState(false)
  const [imgError, setImgError] = useState(false)

  const cartItem = cart.find(item => item.id === product.id)
  const quantity = cartItem ? cartItem.quantity : 0

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  const showImage = product.image && !imgError

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-hover hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 flex flex-col border border-stone-100/80">

      {/* ── Visuel produit ─────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-cream-100 h-44">
        {showImage ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, #F0F7F4 0%, #F7F2E8 100%)' }}>
            {product.emoji?.trim() ? (
              <span className="text-6xl">{product.emoji}</span>
            ) : (
              <span className="text-4xl opacity-15">📦</span>
            )}
          </div>
        )}

        {/* Overlay bas */}
        {showImage && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
        )}

        {/* Badge promo */}
        {product.promo && product.available && (
          <span className="absolute top-2.5 right-2.5 text-[10px] font-bold bg-terra-500 text-white px-2.5 py-1 rounded-full tracking-widest uppercase shadow-sm">
            Promo
          </span>
        )}

        {/* Badge indisponible */}
        {!product.available && (
          <div className="absolute inset-0 bg-black/45 flex items-center justify-center backdrop-blur-[1px]">
            <span className="bg-white/95 text-stone-600 text-xs font-semibold px-3 py-1.5 rounded-full">
              Indisponible
            </span>
          </div>
        )}
      </div>

      {/* ── Infos produit ──────────────────────────────────────── */}
      <div className="p-4 flex flex-col flex-1">

        {/* Catégorie */}
        <span className="inline-block text-[10px] font-semibold uppercase tracking-widest text-primary-600 mb-1.5">
          {product.category}
        </span>

        <h3 className="font-semibold text-primary-800 text-sm leading-snug mb-1.5 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-xs text-stone-400 leading-relaxed flex-1 mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Prix + stock */}
        <div className="flex items-baseline justify-between mb-3.5">
          <div>
            <span className="text-primary-500 font-bold text-xl">
              {parseFloat(product.price).toFixed(2)} €
            </span>
            <span className="text-xs text-stone-400 ml-1.5">/ {product.unit}</span>
          </div>
          {product.available && (
            <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full font-medium">
              En stock
            </span>
          )}
        </div>

        {/* ── Bouton / contrôle quantité ──────────────────────── */}
        {product.available ? (
          quantity === 0 ? (
            <button
              onClick={handleAdd}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                added
                  ? 'bg-emerald-500 text-white scale-[0.98]'
                  : 'bg-primary-900 hover:bg-primary-800 text-white hover:scale-[1.01] active:scale-95'
              }`}
            >
              {added ? (
                <><Check size={15} /> Ajouté !</>
              ) : (
                <><ShoppingCart size={15} /> Ajouter</>
              )}
            </button>
          ) : (
            <div className="flex items-center justify-between bg-primary-50 rounded-xl p-1 border border-primary-100">
              <button
                onClick={() => updateQty(product.id, quantity - 1)}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white shadow-card hover:bg-red-50 hover:text-red-500 transition-colors border border-stone-200/80"
              >
                <Minus size={13} />
              </button>
              <span className="font-bold text-primary-800 text-base min-w-[2rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => updateQty(product.id, quantity + 1)}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary-900 hover:bg-primary-800 text-white transition-colors"
              >
                <Plus size={13} />
              </button>
            </div>
          )
        ) : (
          <button disabled className="w-full py-2.5 rounded-xl text-sm font-medium bg-stone-100 text-stone-400 cursor-not-allowed">
            Indisponible
          </button>
        )}
      </div>
    </div>
  )
}
