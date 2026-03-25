import Link from 'next/link'
import { sql } from '@/lib/db'
import ProductCard from '@/components/ProductCard'

export const dynamic = 'force-dynamic'

function fmtTime(t) { return (t || '').replace(/^0/, '').replace(':', 'h') }
function fmtHours(h) { return h.open ? `${fmtTime(h.openTime)} – ${fmtTime(h.closeTime)}` : 'Fermé' }
import {
  ShoppingBag, CalendarCheck, Store, CreditCard,
  MapPin, Phone, Mail, Clock, ArrowRight, CheckCircle
} from 'lucide-react'

export default async function HomePage() {
  const DAY_ORDER = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']
  const [hoursRows, products] = await Promise.all([
    sql`SELECT day, open, open_time AS "openTime", close_time AS "closeTime" FROM hours`.then(rows =>
      [...rows].sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day))
    ).catch(() => []),
    sql`SELECT * FROM products ORDER BY id`.catch(() => []),
  ])
  const hours = hoursRows
  // Jour actuel (0=dim, 1=lun, ...) → réordre pour commencer lundi
  const dayOrder = [6, 0, 1, 2, 3, 4, 5] // index dans hours.json
  const todayIdx = dayOrder[(new Date().getDay())]
  const todayHours = hours[todayIdx] ?? null
  const todayLabel = todayHours
    ? (todayHours.open ? `Ouvert · ${fmtHours(todayHours)}` : 'Fermé aujourd\'hui')
    : 'Lun – Sam · 8h00 – 18h00'

  const featuredProducts = (() => {
    const feat = products.filter(p => p.available && p.featured)
    return feat.length > 0 ? feat : products.filter(p => p.available).slice(0, 4)
  })()

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[82vh] md:min-h-[92vh] flex items-center overflow-hidden">

        {/* Image de fond */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?w=1800&q=80')" }}
        />
        {/* Overlay sombre */}
        <div className="absolute inset-0 bg-primary-900/78" />
        {/* Teinte ambrée */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 65% 55% at 3% 90%, rgba(201,161,74,0.22) 0%, transparent 60%), radial-gradient(ellipse 40% 45% at 97% 5%, rgba(201,161,74,0.12) 0%, transparent 55%)'
        }} />
        {/* Dégradé bas → blanc */}
        <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-white to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-10 pb-16 md:py-28 w-full">

          {/* ── Layout desktop: texte gauche + carte droite ── */}
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14">

            {/* Texte principal */}
            <div className="flex-1 text-center md:text-left">
              <div className="anim-fade-in inline-flex items-center gap-2 bg-primary-500/20 border border-primary-500/40 text-primary-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase">
                <MapPin size={11} />
                Poroani · Mayotte (976)
              </div>

              <h1 className="anim-fade-up font-serif text-[2.6rem] leading-[1.05] md:text-6xl lg:text-7xl font-semibold text-white mb-5">
                Chez Andy&apos;s<br />
                <span className="text-primary-400">Grossiste</span><br />
                <span className="text-primary-400">alimentaire</span>
              </h1>

              <p className="anim-fade-up-1 text-stone-300 text-base md:text-lg leading-relaxed mb-8 max-w-md mx-auto md:mx-0">
                Commandez en ligne, choisissez votre créneau de retrait.
                Récupérez à Poroani et payez sur place.
              </p>

              <div className="anim-fade-up-2 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Link
                  href="/produits"
                  className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-400 active:scale-95 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm"
                >
                  <ShoppingBag size={17} />
                  Voir le catalogue
                </Link>
                <Link
                  href="/reservation"
                  className="inline-flex items-center justify-center gap-2 glass text-white font-semibold px-8 py-4 rounded-xl transition-all text-sm hover:bg-white/15 active:scale-95"
                >
                  <CalendarCheck size={17} />
                  Réserver un créneau
                </Link>
              </div>
            </div>

            {/* Carte infos — visible seulement sur desktop */}
            <div className="anim-fade-up-3 hidden md:block flex-shrink-0 w-full max-w-[270px] glass-dark rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-white font-semibold text-sm tracking-wide">Ouvert aujourd&apos;hui</p>
              </div>
              <ul className="space-y-3.5">
                {[
                  { icon: <Clock size={14} />,    text: todayLabel },
                  { icon: <MapPin size={14} />,   text: '3 rue Mairie Annexe, Poroani\nQuartier 100 Villas — 97620 Chirongui' },
                  { icon: <Phone size={14} />,    text: '+262 639 07 71 61' },
                  { icon: <CreditCard size={14} />, text: 'Paiement sur place' },
                  { icon: <Store size={14} />,    text: 'Retrait en magasin' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-stone-300 text-sm">
                    <span className="text-primary-500 shrink-0 mt-0.5">{item.icon}</span>
                    <span className="leading-snug whitespace-pre-line">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Info strip — visible seulement sur mobile ── */}
          <div className="anim-fade-up-3 mt-6 rounded-2xl overflow-hidden border border-white/15 md:hidden" style={{ background: 'rgba(15,12,10,0.82)', backdropFilter: 'blur(16px)' }}>
            {/* En-tête */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-white font-semibold text-sm">Ouvert aujourd&apos;hui</p>
            </div>
            {/* Infos */}
            <div className="grid grid-cols-2 gap-px bg-white/8">
              {[
                { icon: <Clock size={14} />,      text: todayHours ? (todayHours.open ? `Ouvert\n${fmtHours(todayHours)}` : 'Fermé\naujourd\'hui') : 'Lun – Sam\n8h00 – 18h00' },
                { icon: <Phone size={14} />,      text: '+262 639\n07 71 61' },
                { icon: <MapPin size={14} />,     text: 'Poroani\n97620 Chirongui' },
                { icon: <CreditCard size={14} />, text: 'Paiement\nsur place' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3" style={{ background: 'rgba(15,12,10,0.82)' }}>
                  <span className="text-primary-500 shrink-0">{item.icon}</span>
                  <span className="text-stone-200 text-xs font-medium leading-snug whitespace-pre-line">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          COMMENT ÇA MARCHE
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-16 md:py-24 border-t-2 border-primary-500/15">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary-500 text-xs font-semibold tracking-widest uppercase mb-3">Simple & rapide</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-primary-800">Comment ça marche</h2>
          </div>

          {/* Desktop : grille 4 colonnes / Mobile : liste verticale en cartes */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="hidden lg:block absolute top-9 left-[calc(12.5%+1rem)] right-[calc(12.5%+1rem)] h-px bg-primary-100 z-0" />
            {[
              { icon: <ShoppingBag size={22} />, step: '01', title: 'Choisissez', desc: 'Parcourez le catalogue et ajoutez vos produits au panier.' },
              { icon: <CalendarCheck size={22} />, step: '02', title: 'Réservez', desc: 'Sélectionnez une date et un créneau horaire de retrait.' },
              { icon: <Store size={22} />, step: '03', title: 'Récupérez', desc: "Présentez-vous chez Andy's à Poroani à l'heure choisie." },
              { icon: <CreditCard size={22} />, step: '04', title: 'Payez', desc: 'Le règlement se fait directement en magasin.' },
            ].map((item) => (
              <div key={item.step} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-primary-800 text-primary-500 flex items-center justify-center mb-4 shadow-lg ring-4 ring-white group-hover:bg-primary-700 group-hover:scale-105 transition-all duration-300">
                  {item.icon}
                </div>
                <span className="text-primary-400 text-xs font-bold tracking-widest mb-1">{item.step}</span>
                <h3 className="font-serif font-semibold text-primary-800 text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Mobile : cartes horizontales */}
          <div className="sm:hidden space-y-3">
            {[
              { icon: <ShoppingBag size={18} />, step: '01', title: 'Choisissez', desc: 'Parcourez le catalogue et ajoutez vos produits.' },
              { icon: <CalendarCheck size={18} />, step: '02', title: 'Réservez', desc: 'Choisissez une date et un créneau horaire.' },
              { icon: <Store size={18} />, step: '03', title: 'Récupérez', desc: "Venez chercher votre commande chez Andy's." },
              { icon: <CreditCard size={18} />, step: '04', title: 'Payez', desc: 'Réglement sur place en magasin.' },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-4 bg-stone-50 rounded-2xl p-4 border border-stone-100">
                <div className="w-12 h-12 rounded-full bg-primary-800 text-primary-400 flex items-center justify-center shrink-0 shadow-sm">
                  {item.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-primary-400 text-xs font-bold">{item.step}</span>
                    <h3 className="font-serif font-semibold text-primary-800">{item.title}</h3>
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          PRODUITS EN VEDETTE
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8 md:mb-12">
            <div>
              <p className="text-primary-500 text-xs font-semibold tracking-widest uppercase mb-2">Sélection du moment</p>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-primary-800">Nos produits</h2>
            </div>
            <Link
              href="/produits"
              className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-800 font-medium text-sm border-b border-primary-300 hover:border-primary-600 transition-colors pb-0.5"
            >
              <span className="hidden sm:inline">Tout le catalogue</span>
              <span className="sm:hidden">Voir tout</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          À PROPOS
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="apropos" className="bg-white py-16 md:py-28">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">

            {/* Image avec overlays */}
            <div className="relative rounded-2xl overflow-hidden shadow-hover aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&q=80"
                alt="Entrepôt Chez Andy's"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-primary-900/15 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-900/25 to-transparent" />

              {/* Badge principal */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                <p className="text-xs text-stone-500 font-medium">Grossiste alimentaire</p>
                <p className="font-serif font-semibold text-primary-800 text-lg leading-tight">Poroani, Mayotte</p>
              </div>

              {/* Stat */}
              <div className="absolute top-4 right-4 bg-primary-500/90 backdrop-blur-sm rounded-xl px-3 py-2 text-center shadow-lg">
                <p className="text-white font-bold text-xl leading-none">+50</p>
                <p className="text-primary-100 text-[10px] mt-0.5 font-medium">références</p>
              </div>
            </div>

            {/* Texte */}
            <div>
              <p className="text-primary-500 text-xs font-semibold tracking-widest uppercase mb-3">À propos</p>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-primary-800 leading-tight mb-5">
                Andy&apos;s,<br />votre partenaire<br />alimentaire
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4 text-sm md:text-base">
                Basé à Poroani, Andy&apos;s approvisionne les professionnels et particuliers
                en produits alimentaires — boissons, épicerie, conserves, céréales.
              </p>
              <p className="text-stone-600 leading-relaxed mb-7 text-sm md:text-base">
                Grâce à la réservation en ligne, préparez votre commande depuis chez vous
                et passez la récupérer au créneau qui vous convient. Sans attente.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  'Large gamme de produits alimentaires',
                  'Réservation en ligne, sans frais',
                  'Paiement sur place à la récupération',
                  'Ouvert du lundi au samedi',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-stone-700">
                    <span className="w-5 h-5 rounded-full bg-primary-50 border border-primary-200 flex items-center justify-center shrink-0">
                      <CheckCircle size={12} className="text-primary-500" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/produits"
                className="inline-flex items-center gap-2 bg-primary-800 hover:bg-primary-700 active:scale-95 text-white font-semibold px-6 py-3.5 rounded-xl text-sm transition-all"
              >
                Parcourir le catalogue <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          CTA
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-primary-900 py-20 md:py-28">
        {/* Image de fond */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&q=70')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/50 to-primary-900/95" />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 55% 70% at 50% 50%, rgba(201,161,74,0.14) 0%, transparent 65%)'
        }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <p className="text-primary-400 text-xs font-semibold tracking-widest uppercase mb-4">Prêt à commander ?</p>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-white mb-5">Passez votre commande</h2>
          <p className="text-stone-400 text-sm md:text-base mb-10 max-w-lg mx-auto leading-relaxed">
            Ajoutez vos produits, réservez un créneau, venez récupérer et payez sur place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/produits"
              className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-400 active:scale-95 text-white font-semibold px-8 py-4 rounded-xl transition-all text-sm shadow-lg hover:-translate-y-0.5"
            >
              <ShoppingBag size={17} /> Voir les produits
            </Link>
            <Link
              href="/reservation"
              className="inline-flex items-center justify-center gap-2 glass text-white font-semibold px-8 py-4 rounded-xl transition-all text-sm hover:bg-white/15 active:scale-95"
            >
              <CalendarCheck size={17} /> Réserver
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          CONTACT
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="contact" className="bg-white py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10 md:mb-14">
            <p className="text-primary-500 text-xs font-semibold tracking-widest uppercase mb-3">Nous trouver</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-primary-800">Contact</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { icon: <MapPin size={22} />, title: 'Adresse', lines: ['3 rue Mairie Annexe, Poroani', 'Quartier 100 Villas — 97620 Chirongui'] },
              { icon: <Phone size={22} />, title: 'Téléphone', lines: ['+262 639 07 71 61'] },
              { icon: <Mail size={22} />, title: 'Email', lines: ['contact@chezandys.com'] },
            ].map(item => (
              <div key={item.title} className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-0 p-5 sm:p-8 rounded-2xl bg-stone-50 border border-stone-100 hover:border-primary-200 hover:shadow-card transition-all">
                <div className="w-11 h-11 sm:w-12 sm:h-12 sm:mb-4 rounded-xl bg-primary-800 text-primary-500 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-primary-800 text-sm mb-1">{item.title}</h3>
                  {item.lines.map(line => (
                    <p key={line} className="text-stone-500 text-sm leading-relaxed">{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Horaires */}
          <div className="max-w-sm mx-auto bg-stone-50 rounded-2xl p-6 border border-stone-100">
            <div className="flex items-center gap-2.5 mb-4">
              <Clock size={16} className="text-primary-500" />
              <h3 className="font-semibold text-primary-800 text-sm">Horaires d&apos;ouverture</h3>
            </div>
            {hours.map(h => (
              <div key={h.day} className="flex justify-between py-2.5 border-b border-stone-100 last:border-0 text-sm">
                <span className="text-stone-500">{h.day}</span>
                <span className={`font-semibold ${!h.open ? 'text-red-400' : 'text-primary-800'}`}>
                  {fmtHours(h)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
