'use client'

import { createContext, useContext, useReducer, useEffect } from 'react'

// ─── Contexte du panier ──────────────────────────────────────────────────────
// Gère l'état global du panier (ajout, suppression, quantité)
// Persistance via localStorage pour conserver le panier entre les pages

const CartContext = createContext(null)

// Actions possibles sur le panier
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_CART':
      return action.payload

    case 'ADD_ITEM': {
      const existing = state.find(item => item.id === action.payload.id)
      if (existing) {
        // Produit déjà dans le panier : on incrémente la quantité
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      // Nouveau produit : on l'ajoute avec quantité 1
      return [...state, { ...action.payload, price: parseFloat(action.payload.price), quantity: 1 }]
    }

    case 'REMOVE_ITEM':
      return state.filter(item => item.id !== action.payload)

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload
      if (quantity <= 0) {
        // Si quantité tombe à 0, on retire le produit
        return state.filter(item => item.id !== id)
      }
      return state.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    }

    case 'CLEAR_CART':
      return []

    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, [])

  // Chargement du panier depuis localStorage au démarrage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('andys-cart')
      if (saved) {
        dispatch({ type: 'LOAD_CART', payload: JSON.parse(saved) })
      }
    } catch {
      // Ignore les erreurs de parsing localStorage
    }
  }, [])

  // Sauvegarde automatique du panier à chaque modification
  useEffect(() => {
    localStorage.setItem('andys-cart', JSON.stringify(cart))
  }, [cart])

  // Nombre total d'articles dans le panier
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  // Prix total indicatif
  const totalPrice = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0)

  const addItem    = (product)         => dispatch({ type: 'ADD_ITEM', payload: product })
  const removeItem = (id)              => dispatch({ type: 'REMOVE_ITEM', payload: id })
  const updateQty  = (id, quantity)    => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  const clearCart  = ()                => dispatch({ type: 'CLEAR_CART' })

  return (
    <CartContext.Provider value={{ cart, totalItems, totalPrice, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

// Hook pratique pour accéder au contexte du panier
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart doit être utilisé dans un CartProvider')
  return ctx
}
