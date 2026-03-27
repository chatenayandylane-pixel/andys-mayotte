'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { ShoppingCart, Menu, X, Home, ShoppingBag, CalendarCheck, Package } from 'lucide-react'

export default function Header() {
  const { totalItems } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled]   = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 56)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { href: '/',         label: 'Accueil' },
    { href: '/produits', label: 'Produits' },
    { href: '/#apropos', label: 'À propos' },
    { href: '/#contact', label: 'Contact' },
  ]

  const bottomNav = [
    { href: '/',            icon: <Home size={21} />,          label: 'Accueil' },
    { href: '/produits',    icon: <Package size={21} />,       label: 'Produits' },
    { href: '/panier',      icon: <ShoppingCart size={21} />,  label: 'Panier',  badge: totalItems },
    { href: '/reservation', icon: <CalendarCheck size={21} />, label: 'Réserver' },
  ]

  return (
    <>
      {/* ── Header desktop + mobile top ─────────────────────────────────── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-primary-900 shadow-forest border-b border-white/8'
            : 'bg-primary-900/97 border-b border-white/6'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group min-w-0">
            <div className="relative shrink-0">
              <img
                src="/logo.png"
                alt="Chez Andy's"
                className="h-9 w-9 rounded-full object-cover ring-2 ring-primary-500/40"
                onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
              />
              <div className="hidden h-9 w-9 rounded-full bg-primary-500/20 border border-primary-500/40 items-center justify-center text-primary-400 text-lg font-serif font-bold">
                A
              </div>
            </div>
            <div className="min-w-0">
              <span className="block font-script font-semibold text-xl text-white leading-none">
                Chez Andy&apos;s
              </span>
              <span className="hidden sm:block text-[10px] text-primary-400/80 leading-none mt-1 tracking-wider uppercase">
                Grossiste · Poroani
              </span>
            </div>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-stone-300 hover:text-white transition-colors relative group py-1"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-primary-400 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Panier desktop + hamburger mobile */}
          <div className="flex items-center gap-2">
            <Link
              href="/panier"
              className="hidden md:relative md:inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-400 active:scale-95 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-all shadow-gold"
            >
              <ShoppingCart size={15} />
              Panier
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-primary-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* Hamburger mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-xl text-stone-300 hover:text-white hover:bg-white/10 active:bg-white/15 transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Menu mobile déroulant */}
        {menuOpen && (
          <div className="md:hidden bg-primary-900 border-t border-white/8 px-4 py-3 anim-fade-in">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between py-3.5 text-sm text-stone-300 hover:text-white border-b border-white/6 last:border-0 transition-colors"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                {link.label}
                <span className="text-primary-600 text-xs">→</span>
              </Link>
            ))}
            <div className="pt-3 pb-1">
              <Link
                href="/panier"
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-primary-500 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
              >
                <ShoppingCart size={15} />
                Mon panier{totalItems > 0 && ` (${totalItems})`}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Barre de navigation mobile — fixée en bas ──────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-primary-900/97 backdrop-blur-sm border-t border-white/10 safe-pb">
        <div className="grid grid-cols-4 h-16">
          {bottomNav.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center gap-1 text-stone-500 hover:text-primary-400 active:text-primary-300 transition-colors"
            >
              <span className="relative">
                {item.icon}
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </span>
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}
