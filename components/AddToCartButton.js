'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { ShoppingBag, Check } from 'lucide-react'

export default function AddToCartButton({ product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleClick = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={handleClick}
      disabled={!product.available}
      className={`inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95 ${
        added
          ? 'bg-emerald-500 text-white scale-[0.98]'
          : product.available
            ? 'bg-primary-500 hover:bg-primary-400 text-white hover:-translate-y-0.5 shadow-gold'
            : 'bg-stone-200 text-stone-400 cursor-not-allowed'
      }`}
    >
      {added ? (
        <><Check size={18} /> Ajouté !</>
      ) : (
        <><ShoppingBag size={18} /> Ajouter au panier</>
      )}
    </button>
  )
}
