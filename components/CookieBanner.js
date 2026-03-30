'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cookie, X, Check } from 'lucide-react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cookie_consent')
      if (!consent) setVisible(true)
    } catch {
      // localStorage non disponible
    }
  }, [])

  const accept = () => {
    try { localStorage.setItem('cookie_consent', 'accepted') } catch {}
    setVisible(false)
  }

  const refuse = () => {
    try { localStorage.setItem('cookie_consent', 'refused') } catch {}
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:bottom-4 md:left-4 md:right-auto md:max-w-sm"
      role="dialog"
      aria-label="Gestion des cookies"
    >
      <div className="bg-primary-900 border-t border-white/10 md:border md:border-white/12 md:rounded-2xl shadow-2xl px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center shrink-0 mt-0.5">
            <Cookie size={16} className="text-primary-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm mb-1">Cookies</p>
            <p className="text-stone-400 text-xs leading-relaxed">
              Ce site utilise uniquement des cookies techniques nécessaires à son fonctionnement (panier, session).
              Aucun cookie publicitaire.{' '}
              <Link href="/politique-confidentialite#cookies" className="text-primary-400 underline underline-offset-2 hover:text-primary-300 transition-colors">
                En savoir plus
              </Link>
            </p>
          </div>
          <button
            onClick={refuse}
            className="text-stone-600 hover:text-stone-400 transition-colors shrink-0 mt-0.5"
            aria-label="Fermer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={refuse}
            className="flex-1 text-xs font-semibold text-stone-400 hover:text-stone-200 border border-white/12 hover:border-white/20 rounded-xl py-2.5 transition-all"
          >
            Refuser
          </button>
          <button
            onClick={accept}
            className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold bg-primary-500 hover:bg-primary-400 text-white rounded-xl py-2.5 transition-all"
          >
            <Check size={13} />
            Accepter
          </button>
        </div>
      </div>
    </div>
  )
}
