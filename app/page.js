import Link from 'next/link'
import { sql } from '@/lib/db'
import ProductCard from '@/components/ProductCard'
import ContactForm from '@/components/ContactForm'
import ReviewForm from '@/components/ReviewForm'
import {
  ShoppingBag, CalendarCheck, Store, CreditCard,
  MapPin, Phone, Mail, Clock, ArrowRight, CheckCircle, Star
} from 'lucide-react'

function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-card flex flex-col">
      {/* Étoiles */}
      <div className="flex gap-0.5 mb-3">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={16}
            fill={review.rating >= star ? '#C9A14A' : 'none'}
            stroke={review.rating >= star ? '#C9A14A' : '#d1d5db'}
            strokeWidth={1.5}
          />
        ))}
      </div>
      {/* Commentaire */}
      <p className="text-stone-600 text-sm leading-relaxed flex-1 mb-4 line-clamp-4">
        &ldquo;{review.comment}&rdquo;
      </p>
      {/* Auteur + date */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-100">
        <p className="font-semibold text-primary-800 text-sm">{review.name || review.author_name}</p>
        {review.created_at && (
          <p className="text-xs text-stone-400">
            {new Date(review.created_at).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
          </p>
        )}
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'

function fmtTime(t) { return (t || '').replace(/^0/, '').replace(':', 'h') }
function fmtHours(h) { return h.open ? `${fmtTime(h.openTime)} – ${fmtTime(h.closeTime)}` : 'Fermé' }

export default async function HomePage() {
  const DAY_ORDER = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']
  const [hoursRows, products, reviews] = await Promise.all([
    sql`SELECT day, open, open_time AS "openTime", close_time AS "closeTime" FROM hours`.then(rows =>
      [...rows].sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day))
    ).catch(() => []),
    sql`SELECT * FROM products ORDER BY id`.catch(() => []),
    sql`SELECT * FROM reviews WHERE approved = true ORDER BY created_at DESC LIMIT 6`.catch(() => []),
  ])
  const hours = hoursRows
  const dayOrder = [6, 0, 1, 2, 3, 4, 5]
  const todayIdx = dayOrder[(new Date().getDay())]
  const todayHours = hours[todayIdx] ?? null
  const todayLabel = todayHours
    ? (todayHours.open ? `Ouvert · ${fmtHours(todayHours)}` : "Fermé aujourd'hui")
    : 'Lun – Sam · 8h00 – 18h00'

  const featuredProducts = (() => {
    const feat = products.filter(p => p.available && p.featured)
    return feat.length > 0 ? feat : products.filter(p => p.available).slice(0, 4)
  })()

  const steps = [
    { icon: <ShoppingBag size={22} />, step: '01', title: 'Choisissez', desc: 'Parcourez le catalogue et ajoutez vos produits au panier.' },
    { icon: <CalendarCheck size={22} />, step: '02', title: 'Réservez', desc: 'Sélectionnez une date et un créneau horaire de retrait.' },
    { icon: <Store size={22} />, step: '03', title: 'Récupérez', desc: "Présentez-vous chez Andy's à Poroani à l'heure choisie." },
    { icon: <CreditCard size={22} />, step: '04', title: 'Payez', desc: 'Le règlement se fait directement en magasin.' },
  ]

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[88vh] md:min-h-screen flex items-center overflow-hidden bg-primary-900">

        {/* Image de fond */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?w=1800&q=80')" }}
        />
        {/* Overlay principal */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(120deg, rgba(10,38,24,0.92) 0%, rgba(10,38,24,0.75) 55%, rgba(10,38,24,0.55) 100%)' }} />
        {/* Lueur or subtile */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 60% 50% at 5% 95%, rgba(201,161,74,0.18) 0%, transparent 55%), radial-gradient(ellipse 35% 40% at 95% 8%, rgba(201,161,74,0.10) 0%, transparent 50%)'
        }} />
        {/* Dégradé bas → section suivante */}
        <div className="absolute bottom-0 left-0 right-0 h-28 md:h-44 bg-gradient-to-t from-[#F7F2E8] to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-10 pb-20 md:py-32 w-full">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-16">

            {/* Texte principal */}
            <div className="flex-1 text-center md:text-left">

              {/* Badge localisation */}
              <div className="anim-fade-in inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.16em] uppercase text-primary-300 border border-primary-500/35 mb-7">
                <MapPin size={10} strokeWidth={2.5} />
                Poroani · Mayotte · 976
              </div>

              {/* Titre principal */}
              <h1
                className="anim-fade-up font-serif font-semibold text-white leading-[0.93] mb-7"
                style={{ fontSize: 'clamp(2.8rem, 8.5vw, 7rem)', textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}
              >
                Votre<br />
                <em className="not-italic" style={{ color: '#C9A14A' }}>grossiste</em><br />
                alimentaire
              </h1>

              <p className="anim-fade-up-1 text-stone-300 text-base md:text-lg leading-relaxed mb-10 max-w-md mx-auto md:mx-0">
                Commandez en ligne, choisissez votre créneau de retrait.
                Récupérez à Poroani et payez sur place.
              </p>

              <div className="anim-fade-up-2 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Link
                  href="/produits"
                  className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-400 active:scale-95 text-white font-semibold px-8 py-4 rounded-xl text-sm transition-all shadow-gold hover:-translate-y-0.5"
                >
                  <ShoppingBag size={16} />
                  Voir le catalogue
                </Link>
                <Link
                  href="/reservation"
                  className="inline-flex items-center justify-center gap-2 glass text-white font-semibold px-8 py-4 rounded-xl text-sm hover:bg-white/15 active:scale-95 transition-all"
                >
                  <CalendarCheck size={16} />
                  Réserver un créneau
                </Link>
              </div>
            </div>

            {/* Carte infos — desktop uniquement */}
            <div className="anim-fade-up-3 hidden md:block flex-shrink-0 w-72 glass-dark rounded-2xl overflow-hidden shadow-forest">
              {/* En-tête */}
              <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/8">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-white font-semibold text-sm">Ouvert aujourd&apos;hui</p>
              </div>
              {/* Infos */}
              <ul className="px-5 py-4 space-y-3.5">
                {[
                  { icon: <Clock size={14} />,      text: todayLabel },
                  { icon: <MapPin size={14} />,     text: '3 rue Mairie Annexe, Poroani\nQuartier 100 Villas — 97620 Chirongui' },
                  { icon: <Phone size={14} />,      text: '+33 672 75 84 78' },
                  { icon: <CreditCard size={14} />, text: 'Paiement sur place' },
                  { icon: <Store size={14} />,      text: 'Retrait en magasin' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-stone-300 text-sm">
                    <span className="text-primary-400 shrink-0 mt-0.5">{item.icon}</span>
                    <span className="leading-snug whitespace-pre-line">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Info strip mobile ────────────────────────────────── */}
          <div className="anim-fade-up-3 mt-8 rounded-2xl overflow-hidden border border-white/12 md:hidden" style={{ background: 'rgba(10,38,24,0.96)' }}>
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-white font-semibold text-sm">Ouvert aujourd&apos;hui</p>
            </div>
            <div className="grid grid-cols-2 gap-px" style={{ background: 'rgba(255,255,255,0.06)' }}>
              {[
                { icon: <Clock size={14} />,      text: todayHours ? (todayHours.open ? `Ouvert\n${fmtHours(todayHours)}` : "Fermé\naujourd'hui") : 'Lun – Sam\n8h00 – 18h00' },
                { icon: <Phone size={14} />,      text: '+33 672\n75 84 78' },
                { icon: <MapPin size={14} />,     text: 'Poroani\n97620 Chirongui' },
                { icon: <CreditCard size={14} />, text: 'Paiement\nsur place' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3" style={{ background: 'rgba(10,38,24,0.97)' }}>
                  <span className="text-primary-500 shrink-0">{item.icon}</span>
                  <span className="text-stone-200 text-xs font-medium leading-snug whitespace-pre-line">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          MARQUEE STRIP
      ══════════════════════════════════════════════════════════════ */}
      <div className="bg-primary-500 overflow-hidden py-2.5 select-none" aria-hidden="true">
        <div className="marquee-track">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="px-6 text-white text-[11px] font-semibold tracking-[0.2em] uppercase whitespace-nowrap opacity-90">
              Grossiste alimentaire&nbsp;&nbsp;·&nbsp;&nbsp;Poroani, Mayotte&nbsp;&nbsp;·&nbsp;&nbsp;Réservation en ligne&nbsp;&nbsp;·&nbsp;&nbsp;Retrait en magasin&nbsp;&nbsp;·&nbsp;&nbsp;Paiement sur place&nbsp;&nbsp;·
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          COMMENT ÇA MARCHE
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-32" style={{ background: '#F7F2E8' }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14 md:mb-18">
            <span className="section-label center">Simple & rapide</span>
            <h2 className="font-serif font-semibold text-primary-800 leading-tight"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              Comment ça marche
            </h2>
          </div>

          {/* Desktop — timeline horizontale */}
          <div className="hidden sm:grid sm:grid-cols-4 gap-0 relative">
            {/* Ligne connecteur */}
            <div className="hidden lg:block absolute top-11 left-[calc(12.5%+1.5rem)] right-[calc(12.5%+1.5rem)] h-px z-0"
                 style={{ background: 'linear-gradient(90deg, rgba(201,161,74,0.3), rgba(201,161,74,0.6), rgba(201,161,74,0.3))' }} />

            {steps.map((item, idx) => (
              <div key={item.step} className={`reveal delay-${idx + 1} relative z-10 flex flex-col items-center text-center px-4`}>
                {/* Numéro décoratif */}
                <div className="relative mb-5">
                  <span
                    className="absolute -top-5 left-1/2 -translate-x-1/2 font-serif font-bold select-none pointer-events-none leading-none"
                    style={{ fontSize: '6rem', color: 'rgba(20,61,44,0.07)', lineHeight: 1 }}
                    aria-hidden="true"
                  >
                    {item.step}
                  </span>
                  <div className="relative z-10 w-[4.5rem] h-[4.5rem] rounded-full bg-primary-900 text-primary-400 flex items-center justify-center shadow-forest ring-4"
                       style={{ '--tw-ring-color': '#F7F2E8', boxShadow: '0 6px 24px rgba(10,38,24,0.28)' }}>
                    {item.icon}
                  </div>
                </div>
                <span className="text-primary-500 text-[10px] font-bold tracking-[0.2em] mb-1.5 uppercase">{item.step}</span>
                <h3 className="font-serif font-semibold text-primary-800 text-xl mb-2">{item.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Mobile — cartes verticales */}
          <div className="sm:hidden space-y-3">
            {steps.map((item, idx) => (
              <div key={item.step} className={`reveal delay-${idx + 1} flex items-center gap-5 bg-white rounded-2xl p-5 shadow-card border border-stone-100`}>
                <div className="w-14 h-14 rounded-full bg-primary-900 text-primary-400 flex items-center justify-center shrink-0 shadow-forest">
                  {item.icon}
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="text-primary-400 text-[10px] font-bold tracking-widest uppercase">{item.step}</span>
                    <h3 className="font-serif font-semibold text-primary-800 text-lg leading-none">{item.title}</h3>
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          PRODUITS EN VEDETTE
      ══════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-20 md:py-28 border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="reveal flex items-end justify-between mb-10 md:mb-14">
            <div>
              <span className="section-label">Sélection du moment</span>
              <h2 className="font-serif font-semibold text-primary-800 leading-tight"
                  style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}>
                Nos produits
              </h2>
            </div>
            <Link
              href="/produits"
              className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-800 font-medium text-sm transition-colors group"
            >
              <span className="hidden sm:inline">Tout le catalogue</span>
              <span className="sm:hidden">Voir tout</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product, i) => (
                <div key={product.id} className={`reveal delay-${Math.min(i + 1, 5)}`}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-stone-400">
              <p className="font-serif text-xl text-primary-800 mb-2">Catalogue en cours de mise à jour</p>
              <Link href="/produits" className="text-sm text-primary-500 underline">Voir tous les produits</Link>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          À PROPOS — fond forêt
      ══════════════════════════════════════════════════════════════ */}
      <section id="apropos" className="bg-primary-900 py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

            {/* Image */}
            <div className="reveal-left relative">
              <div className="relative rounded-2xl overflow-hidden shadow-forest" style={{ aspectRatio: '4/3' }}>
                <img
                  src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&q=80"
                  alt="Entrepôt Chez Andy's"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/75 via-primary-900/15 to-transparent" />

                {/* Badge bas gauche */}
                <div className="absolute bottom-4 left-4 glass-cream rounded-xl px-4 py-2.5 shadow-lg">
                  <p className="text-stone-600 text-[10px] font-medium tracking-wide uppercase">Grossiste alimentaire</p>
                  <p className="font-serif font-semibold text-primary-800 text-base leading-tight">Poroani, Mayotte</p>
                </div>

                {/* Stat haut droit */}
                <div className="absolute top-4 right-4 bg-primary-500 rounded-xl px-3.5 py-2.5 text-center shadow-gold">
                  <p className="text-white font-bold text-2xl leading-none">50+</p>
                  <p className="text-primary-100 text-[10px] mt-0.5 font-medium tracking-wide">références</p>
                </div>
              </div>
            </div>

            {/* Texte */}
            <div className="reveal-right">
              <span className="section-label" style={{ color: 'rgba(201,161,74,0.85)' }}>
                À propos
              </span>
              <h2
                className="font-serif font-semibold text-white leading-tight mb-6"
                style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3rem)' }}
              >
                Andy&apos;s,<br />votre partenaire<br />alimentaire
              </h2>
              <p className="text-stone-300 leading-relaxed mb-4 text-sm md:text-base">
                Basé à Poroani, Andy&apos;s approvisionne les professionnels et particuliers
                en produits alimentaires — boissons, épicerie, conserves, céréales.
              </p>
              <p className="text-stone-400 leading-relaxed mb-8 text-sm md:text-base">
                Grâce à la réservation en ligne, préparez votre commande depuis chez vous
                et passez la récupérer au créneau qui vous convient. Sans attente.
              </p>

              <ul className="space-y-3 mb-9">
                {[
                  'Large gamme de produits alimentaires',
                  'Réservation en ligne, sans frais',
                  'Paiement sur place à la récupération',
                  'Ouvert du lundi au samedi',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-stone-200">
                    <span className="w-5 h-5 rounded-full bg-primary-500/20 border border-primary-500/40 flex items-center justify-center shrink-0">
                      <CheckCircle size={11} className="text-primary-400" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/produits"
                className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-400 active:scale-95 text-white font-semibold px-7 py-3.5 rounded-xl text-sm transition-all shadow-gold hover:-translate-y-0.5"
              >
                Parcourir le catalogue <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          AVIS CLIENTS
      ══════════════════════════════════════════════════════════════ */}
      {reviews.length > 0 && (
        <section className="py-20 md:py-28 border-t border-stone-100" style={{background: '#F7F2E8'}}>
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="section-label center">Ils nous font confiance</span>
              <h2 className="font-serif font-semibold text-primary-800" style={{fontSize:'clamp(2rem,5vw,3.25rem)'}}>
                Avis clients
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
            <ReviewForm />
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          CTA CENTRAL
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-20 md:py-32" style={{ background: '#F7F2E8' }}>
        {/* Image de fond très subtile */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.06]"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=70')" }}
        />
        {/* Décoration or */}
        <div className="absolute top-0 left-0 right-0 h-px"
             style={{ background: 'linear-gradient(90deg, transparent, rgba(201,161,74,0.35), transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-px"
             style={{ background: 'linear-gradient(90deg, transparent, rgba(201,161,74,0.25), transparent)' }} />

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <span className="section-label center">Prêt à commander ?</span>
          <h2
            className="reveal font-serif font-semibold text-primary-800 mb-6 leading-tight"
            style={{ fontSize: 'clamp(2.2rem, 6vw, 4.5rem)' }}
          >
            Passez votre<br />commande en ligne
          </h2>
          <p className="reveal delay-1 text-stone-600 text-sm md:text-base mb-11 max-w-md mx-auto leading-relaxed">
            Ajoutez vos produits, réservez un créneau, venez récupérer et payez sur place.
          </p>
          <div className="reveal delay-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/produits"
              className="inline-flex items-center justify-center gap-2 bg-primary-900 hover:bg-primary-800 active:scale-95 text-white font-semibold px-8 py-4 rounded-xl text-sm transition-all shadow-forest hover:-translate-y-0.5"
            >
              <ShoppingBag size={16} /> Voir les produits
            </Link>
            <Link
              href="/reservation"
              className="inline-flex items-center justify-center gap-2 border-2 border-primary-800/70 text-primary-800 hover:bg-primary-800 hover:text-white font-semibold px-8 py-4 rounded-xl text-sm transition-all active:scale-95"
            >
              <CalendarCheck size={16} /> Réserver
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CONTACT
      ══════════════════════════════════════════════════════════════ */}
      <section id="contact" className="bg-white py-20 md:py-28 border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">

          {/* Titre */}
          <div className="text-center mb-12 md:mb-16">
            <span className="section-label center">Nous contacter</span>
            <h2
              className="font-serif font-semibold text-primary-800 leading-tight"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}
            >
              Contact & Infos
            </h2>
            <p className="mt-4 text-stone-500 text-sm max-w-md mx-auto leading-relaxed">
              Une question sur une commande, un produit, ou autre ? Envoyez-nous un message, nous répondons rapidement.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">

            {/* ── Colonne gauche : infos + horaires ─────────────────── */}
            <div className="space-y-4">

              {/* Cards infos */}
              {[
                {
                  icon: <MapPin size={18} />,
                  title: 'Adresse',
                  content: <>3 rue Mairie Annexe, Poroani<br />Quartier 100 Villas — 97620 Chirongui</>,
                },
                {
                  icon: <Phone size={18} />,
                  title: 'Téléphone',
                  content: <a href="tel:+33672758478" className="hover:text-primary-700 transition-colors">+33 672 75 84 78</a>,
                },
                {
                  icon: <Mail size={18} />,
                  title: 'Email',
                  content: <a href="mailto:contact@chezandys.com" className="hover:text-primary-700 transition-colors">contact@chezandys.com</a>,
                },
              ].map((item, i) => (
                <div key={item.title} className={`reveal delay-${i + 1} flex items-start gap-4 p-5 rounded-2xl border`}
                     style={{ background: '#F9F5EE', borderColor: 'rgba(201,161,74,0.18)' }}>
                  <div className="w-10 h-10 rounded-xl bg-primary-900 text-primary-500 flex items-center justify-center shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">{item.title}</p>
                    <p className="text-sm text-stone-700 leading-relaxed">{item.content}</p>
                  </div>
                </div>
              ))}

              {/* Horaires */}
              <div className="reveal delay-4 rounded-2xl p-5 border"
                   style={{ background: '#F9F5EE', borderColor: 'rgba(201,161,74,0.18)' }}>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-900 text-primary-500 flex items-center justify-center shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Horaires</p>
                    <p className="text-sm font-semibold text-primary-800">d&apos;ouverture</p>
                  </div>
                </div>
                {hours.length > 0 ? hours.map(h => (
                  <div key={h.day} className="flex justify-between py-2 border-b border-stone-100 last:border-0 text-sm">
                    <span className="text-stone-500">{h.day}</span>
                    <span className={`font-semibold ${!h.open ? 'text-stone-400' : 'text-primary-800'}`}>
                      {fmtHours(h)}
                    </span>
                  </div>
                )) : (
                  <p className="text-sm text-stone-500">Lun – Sam : 8h00 – 18h00</p>
                )}
              </div>
            </div>

            {/* ── Colonne droite : formulaire ───────────────────────── */}
            <div className="reveal delay-2 rounded-2xl border p-7 md:p-9 shadow-card"
                 style={{ background: '#FDFAF5', borderColor: 'rgba(201,161,74,0.18)' }}>
              <h3 className="font-serif font-semibold text-primary-800 text-xl mb-1">Envoyez-nous un message</h3>
              <p className="text-stone-500 text-sm mb-6 leading-relaxed">
                Réponse sous 24h en général.
              </p>
              <ContactForm />
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
