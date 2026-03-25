'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

function fmtTime(t) { return t.replace(/^0/, '').replace(':', 'h') }

export default function Footer() {
  const [hours, setHours] = useState([])
  useEffect(() => {
    fetch('/api/hours').then(r => r.json()).then(setHours).catch(() => {})
  }, [])
  return (
    <footer className="bg-primary-800 text-stone-300 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Colonne 1 — Identité */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/logo.png"
              alt="Chez Andy's"
              className="h-9 w-9 rounded-full object-cover"
              onError={e => { e.target.style.display = 'none' }}
            />
            <span className="text-white font-serif font-semibold text-lg">Chez Andy&apos;s</span>
          </div>
          <p className="text-sm leading-relaxed text-stone-400">
            Grossiste alimentaire à Poroani, Mayotte.
            Réservez en ligne, récupérez en magasin.
          </p>
        </div>

        {/* Colonne 2 — Informations pratiques */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">Infos pratiques</h3>
          <ul className="space-y-2.5 text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={15} className="text-primary-500 mt-0.5 shrink-0" />
              {/* ← Adresse */}
              <span>3 rue Mairie Annexe, Poroani<br />Quartier 100 Villas — 97620 Chirongui</span>
            </li>
            <li className="flex items-start gap-2">
              <Phone size={15} className="text-primary-500 mt-0.5 shrink-0" />
              {/* ← Numéro de téléphone */}
              <span>+262 639 07 71 61</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail size={15} className="text-primary-500 mt-0.5 shrink-0" />
              {/* ← Adresse email */}
              <span>contact@chezandys.com</span>
            </li>
            {hours.length > 0 ? (
              <li className="flex items-start gap-2">
                <Clock size={15} className="text-primary-500 mt-0.5 shrink-0" />
                <span>
                  {hours.filter(h => h.open).map(h => h.day.slice(0, 3)).join(', ')}<br />
                  {(() => {
                    const open = hours.find(h => h.open)
                    return open ? `${fmtTime(open.openTime)} – ${fmtTime(open.closeTime)}` : ''
                  })()}
                </span>
              </li>
            ) : (
              <li className="flex items-start gap-2">
                <Clock size={15} className="text-primary-500 mt-0.5 shrink-0" />
                <span>Lun – Sam : 8h00 – 18h00</span>
              </li>
            )}
          </ul>
        </div>

        {/* Colonne 3 — Navigation */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">Navigation</h3>
          <ul className="space-y-2 text-sm">
            {[
              { href: '/',            label: 'Accueil' },
              { href: '/produits',    label: 'Nos produits' },
              { href: '/panier',      label: 'Mon panier' },
              { href: '/reservation', label: 'Réserver' },
              { href: '/#contact',    label: 'Contact' },
            ].map(link => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 relative">
        <p className="text-center text-xs text-stone-500 mb-1">
          © {new Date().getFullYear()} Chez Andy&apos;s — Poroani, Mayotte. Tous droits réservés.
        </p>
        <p className="text-center text-stone-600" style={{ fontSize: '10px', lineHeight: '1.6' }}>
          SAS — SIREN&nbsp;938&nbsp;321&nbsp;536 — RCS&nbsp;938&nbsp;321&nbsp;536&nbsp;R.C.S.&nbsp;Mamoudzou — N°&nbsp;TVA&nbsp;FR79938321536
        </p>
        {/* Bouton admin discret — bas droite */}
        <Link
          href="/admin"
          className="absolute bottom-3 right-4 text-stone-700 hover:text-stone-500 transition-colors"
          title="Administration"
          style={{ fontSize: '10px' }}
        >
          ⚙
        </Link>
      </div>
    </footer>
  )
}
