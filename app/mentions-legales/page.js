import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: "Mentions légales — Chez Andy's",
  description: "Mentions légales du site Chez Andy's, grossiste alimentaire à Poroani, Mayotte.",
}

export default function MentionsLegalesPage() {
  return (
    <div className="bg-white min-h-screen">

      {/* En-tête */}
      <div className="bg-primary-900 py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm mb-6 transition-colors">
            <ArrowLeft size={14} /> Retour à l&apos;accueil
          </Link>
          <h1 className="font-serif font-semibold text-white text-3xl md:text-4xl">Mentions légales</h1>
          <p className="text-stone-400 text-sm mt-2">Dernière mise à jour : mars 2025</p>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16 space-y-10 text-stone-700">

        <Section title="1. Éditeur du site">
          <p>Le site <strong>chezandys.com</strong> est édité par :</p>
          <ul className="mt-3 space-y-1 text-sm">
            <li><strong>Dénomination sociale :</strong> Andy&apos;s (Chez Andy&apos;s)</li>
            <li><strong>Forme juridique :</strong> Société par Actions Simplifiée (SAS)</li>
            <li><strong>SIREN :</strong> 938 321 536</li>
            <li><strong>N° TVA intracommunautaire :</strong> FR79938321536</li>
            <li><strong>RCS :</strong> 938 321 536 R.C.S. Mamoudzou</li>
            <li><strong>Siège social :</strong> 3 rue Mairie Annexe, Poroani, Quartier 100 Villas — 97620 Chirongui, Mayotte (976)</li>
            <li><strong>Téléphone :</strong> +33 672 75 84 78</li>
            <li><strong>Email :</strong> contact@chezandys.com</li>
          </ul>
        </Section>

        <Section title="2. Directeur de la publication">
          <p>Le directeur de la publication est le représentant légal de la société Andy&apos;s.</p>
          <p className="mt-2 text-sm">Contact : <a href="mailto:contact@chezandys.com" className="text-primary-700 underline">contact@chezandys.com</a></p>
        </Section>

        <Section title="3. Hébergement">
          <p>Le site est hébergé par :</p>
          <ul className="mt-3 space-y-1 text-sm">
            <li><strong>Hébergeur :</strong> Vercel Inc.</li>
            <li><strong>Adresse :</strong> 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis</li>
            <li><strong>Site :</strong> <a href="https://vercel.com" className="text-primary-700 underline" target="_blank" rel="noopener noreferrer">vercel.com</a></li>
          </ul>
          <p className="mt-3 text-sm">La base de données est hébergée par <strong>Neon Inc.</strong> (PostgreSQL serverless), 101 Second Street, San Francisco, CA 94105, États-Unis.</p>
        </Section>

        <Section title="4. Propriété intellectuelle">
          <p>L&apos;ensemble du contenu de ce site (textes, images, graphismes, logo, icônes, etc.) est la propriété exclusive de la société Andy&apos;s ou de ses partenaires, et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.</p>
          <p className="mt-3">Toute reproduction, distribution, modification, adaptation, retransmission ou publication, même partielle, de ces différents éléments est strictement interdite sans l&apos;accord exprès par écrit d&apos;Andy&apos;s.</p>
        </Section>

        <Section title="5. Données personnelles">
          <p>Les informations recueillies via ce site (formulaire de réservation, formulaire de contact) font l&apos;objet d&apos;un traitement informatique destiné à la gestion des commandes et à la communication avec les clients.</p>
          <p className="mt-3">Conformément au Règlement Général sur la Protection des Données (RGPD - UE 2016/679) et à la loi Informatique et Libertés du 6 janvier 1978 modifiée, vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;opposition et de suppression de vos données.</p>
          <p className="mt-3">Pour exercer ces droits, contactez-nous à : <a href="mailto:contact@chezandys.com" className="text-primary-700 underline">contact@chezandys.com</a></p>
          <p className="mt-3">Pour plus d&apos;informations, consultez notre <Link href="/politique-confidentialite" className="text-primary-700 underline">Politique de confidentialité</Link>.</p>
        </Section>

        <Section title="6. Cookies">
          <p>Ce site utilise des cookies techniques nécessaires à son fonctionnement (panier, session). Aucun cookie publicitaire ou de traçage tiers n&apos;est utilisé.</p>
          <p className="mt-3">Pour en savoir plus : <Link href="/politique-confidentialite#cookies" className="text-primary-700 underline">Politique cookies</Link>.</p>
        </Section>

        <Section title="7. Limitation de responsabilité">
          <p>Andy&apos;s s&apos;efforce d&apos;assurer l&apos;exactitude et la mise à jour des informations diffusées sur ce site. Cependant, Andy&apos;s ne peut garantir l&apos;exhaustivité des informations disponibles sur ce site ni leur adéquation avec un usage particulier.</p>
          <p className="mt-3">Andy&apos;s décline toute responsabilité pour les dommages résultant d&apos;une intrusion frauduleuse d&apos;un tiers ayant entraîné une modification des informations mises à disposition sur le site.</p>
        </Section>

        <Section title="8. Droit applicable">
          <p>Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>
        </Section>

        <div className="pt-4 border-t border-stone-100 flex gap-6 text-sm">
          <Link href="/cgv" className="text-primary-700 underline hover:text-primary-900">CGV</Link>
          <Link href="/politique-confidentialite" className="text-primary-700 underline hover:text-primary-900">Politique de confidentialité</Link>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="font-serif font-semibold text-primary-800 text-xl mb-4 pb-2 border-b border-stone-100">{title}</h2>
      <div className="text-sm leading-relaxed space-y-2">{children}</div>
    </div>
  )
}
