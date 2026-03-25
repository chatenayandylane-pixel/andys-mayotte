'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { ShoppingCart, Plus, Minus, CheckCircle } from 'lucide-react'

export default function ProductCard({ product }) {
  const { cart, addItem, updateQty } = useCart()
  const [added, setAdded]       = useState(false)
  const [imgError, setImgError] = useState(false)

  const cartItem = cart.find(item => item.id === product.id)
  const quantity = cartItem ? cartItem.quantity : 0

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  const showImage = product.image && !imgError

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-hover hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 flex flex-col border border-stone-100">

      {/* ── Image produit ──────────────────────────────────────────────────── */}
      {/* Pour changer l'image d'un produit, modifiez le champ "image" dans    */}
      {/* data/products.json (URL web) ou via l'interface admin (/admin).      */}
      <div className="relative overflow-hidden bg-primary-50 h-44">
        {showImage ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary-50">
            {product.emoji?.trim() ? (
              <span className="text-6xl">{product.emoji}</span>
            ) : (
              <span className="text-4xl opacity-20">📦</span>
            )}
          </div>
        )}

        {/* Overlay dégradé bas pour lisibilité */}
        {showImage && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        )}

        {/* Badge catégorie */}
        <span className="absolute top-3 left-3 text-xs font-medium bg-white/90 backdrop-blur-sm text-primary-700 px-2.5 py-1 rounded-full shadow-sm">
          {product.category}
        </span>

        {/* Badge promo */}
        {product.promo && product.available && (
          <span className="absolute top-3 right-3 text-xs font-bold bg-red-500 text-white px-2.5 py-1 rounded-full shadow-sm tracking-wide">
            PROMO
          </span>
        )}

        {/* Badge indisponible */}
        {!product.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full">
              Indisponible
            </span>
          </div>
        )}
      </div>

      {/* ── Infos produit ─────────────────────────────────────────────────── */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-primary-800 text-sm leading-snug mb-1.5">
          {product.name}
        </h3>

        <p className="text-xs text-stone-400 leading-relaxed flex-1 mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Prix */}
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <span className="text-primary-600 font-bold text-xl">
              {product.price.toFixed(2)} €
            </span>
            <span className="text-xs text-stone-400 font-normal ml-1.5">/ {product.unit}</span>
          </div>
          {product.available && (
            <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full font-medium">
              En stock
            </span>
          )}
        </div>

        {/* ── Bouton / contrôle quantité ─────────────────────────────────── */}
        {product.available ? (
          quantity === 0 ? (
            <button
              onClick={handleAdd}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                added
                  ? 'bg-emerald-500 text-white scale-95'
                  : 'bg-primary-800 hover:bg-primary-700 text-white hover:scale-[1.02]'
              }`}
            >
              {added ? (
                <><CheckCircle size={15} /> Ajouté !</>
              ) : (
                <><ShoppingCart size={15} /> Ajouter au panier</>
              )}
            </button>
          ) : (
            <div className="flex items-center justify-between bg-primary-50 rounded-xl p-1 border border-primary-100">
              <button
                onClick={() => updateQty(product.id, quantity - 1)}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-red-50 hover:text-red-500 transition-colors border border-stone-200"
              >
                <Minus size={14} />
              </button>
              <span className="font-bold text-primary-800 text-base min-w-[2rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => updateQty(product.id, quantity + 1)}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary-800 hover:bg-primary-700 text-white transition-colors"
              >
                <Plus size={14} />
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
