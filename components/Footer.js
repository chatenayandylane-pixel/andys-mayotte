'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react'

function fmtTime(t) { return t.replace(/^0/, '').replace(':', 'h') }

export default function Footer() {
  const [hours, setHours] = useState([])
  useEffect(() => {
    fetch('/api/hours').then(r => r.json()).then(setHours).catch(() => {})
  }, [])

  return (
    <footer className="bg-primary-900 text-stone-300">

      {/* ── Corps du footer ────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">

          {/* Col 1 — Identité (5 cols) */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <img
                src="/logo.png"
                alt="Chez Andy's"
                className="h-10 w-10 rounded-full object-cover ring-2 ring-primary-500/30"
                onError={e => { e.target.style.display = 'none' }}
              />
              <div>
                <span className="block font-script font-semibold text-xl text-white leading-none">
                  Chez Andy&apos;s
                </span>
                <span className="block text-[10px] text-primary-400/70 tracking-wider uppercase mt-0.5">
                  Grossiste alimentaire
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-stone-400 max-w-xs mb-6">
              Approvisionnez-vous en produits alimentaires à Poroani, Mayotte.
              Commandez en ligne, récupérez en magasin.
            </p>
            {/* Info rapide */}
            <div className="flex flex-col gap-2.5 text-sm">
              <a href="tel:+33672758478" className="flex items-center gap-2.5 text-stone-400 hover:text-primary-400 transition-colors group">
                <Phone size={14} className="text-primary-500 shrink-0" />
                +33 672 75 84 78
              </a>
              <a href="mailto:contact@chezandys.com" className="flex items-center gap-2.5 text-stone-400 hover:text-primary-400 transition-colors">
                <Mail size={14} className="text-primary-500 shrink-0" />
                contact@chezandys.com
              </a>
              <div className="flex items-start gap-2.5 text-stone-400">
                <MapPin size={14} className="text-primary-500 shrink-0 mt-0.5" />
                <span>3 rue Mairie Annexe, Poroani<br />97620 Chirongui, Mayotte</span>
              </div>
            </div>
          </div>

          {/* Col 2 — Horaires (3 cols) */}
          <div className="md:col-span-3">
            <h3 className="text-white font-semibold text-xs uppercase tracking-widest mb-5 flex items-center gap-2">
              <Clock size={13} className="text-primary-500" />
              Horaires
            </h3>
            {hours.length > 0 ? (
              <ul className="space-y-2">
                {hours.map(h => (
                  <li key={h.day} className="flex justify-between text-xs">
                    <span className="text-stone-500">{h.day.slice(0, 3)}</span>
                    <span className={`font-medium ${!h.open ? 'text-stone-600' : 'text-stone-300'}`}>
                      {h.open ? `${fmtTime(h.openTime)} – ${fmtTime(h.closeTime)}` : 'Fermé'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-stone-400">Lun – Sam : 8h00 – 18h00</p>
            )}
          </div>

          {/* Col 3 — Navigation (4 cols) */}
          <div className="md:col-span-4">
            <h3 className="text-white font-semibold text-xs uppercase tracking-widest mb-5">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: '/',            label: 'Accueil' },
                { href: '/produits',    label: 'Nos produits' },
                { href: '/panier',      label: 'Mon panier' },
                { href: '/reservation',    label: 'Réserver un créneau' },
                { href: '/blog',           label: 'Actualités & Promos' },
                { href: '/mes-commandes',  label: 'Mes commandes' },
                { href: '/#contact',       label: 'Contact' },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-primary-400 transition-colors group"
                  >
                    <ArrowRight size={12} className="text-primary-600 group-hover:translate-x-0.5 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* CTA réservation */}
            <div className="mt-7">
              <Link
                href="/reservation"
                className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-gold active:scale-95"
              >
                Réserver en ligne
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Séparateur + bas de page ──────────────────────────── */}
      <div className="border-t border-white/8 px-4 py-5 relative">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-stone-600">
            © {new Date().getFullYear()} Chez Andy&apos;s — Poroani, Mayotte. Tous droits réservés.
          </p>
          {/* Liens légaux */}
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link href="/mentions-legales" className="text-stone-600 hover:text-stone-400 transition-colors" style={{ fontSize: '10px' }}>
              Mentions légales
            </Link>
            <span className="text-stone-700" style={{ fontSize: '10px' }}>·</span>
            <Link href="/cgv" className="text-stone-600 hover:text-stone-400 transition-colors" style={{ fontSize: '10px' }}>
              CGV
            </Link>
            <span className="text-stone-700" style={{ fontSize: '10px' }}>·</span>
            <Link href="/politique-confidentialite" className="text-stone-600 hover:text-stone-400 transition-colors" style={{ fontSize: '10px' }}>
              Confidentialité & Cookies
            </Link>
            <span className="text-stone-700" style={{ fontSize: '10px' }}>·</span>
            <p className="text-stone-700" style={{ fontSize: '10px' }}>
              SIREN&nbsp;938&nbsp;321&nbsp;536
            </p>
          </div>
        </div>
        <Link
          href="/admin"
          className="absolute bottom-4 right-4 text-stone-800 hover:text-stone-600 transition-colors"
          title="Administration"
          style={{ fontSize: '10px' }}
        >
          ⚙
        </Link>
      </div>
    </footer>
  )
}
