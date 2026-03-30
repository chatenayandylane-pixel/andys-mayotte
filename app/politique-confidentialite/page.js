import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: "Politique de confidentialité & Cookies — Chez Andy's",
  description: "Politique de confidentialité et gestion des cookies du site Chez Andy's, conformément au RGPD.",
}

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="bg-white min-h-screen">

      {/* En-tête */}
      <div className="bg-primary-900 py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm mb-6 transition-colors">
            <ArrowLeft size={14} /> Retour à l&apos;accueil
          </Link>
          <h1 className="font-serif font-semibold text-white text-3xl md:text-4xl">Politique de confidentialité & Cookies</h1>
          <p className="text-stone-400 text-sm mt-2">Dernière mise à jour : mars 2025 — Conforme RGPD (UE 2016/679)</p>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16 space-y-10 text-stone-700">

        <Section title="1. Responsable du traitement">
          <p>Le responsable du traitement des données personnelles collectées sur <strong>chezandys.com</strong> est :</p>
          <ul className="mt-3 space-y-1 text-sm">
            <li><strong>Société :</strong> Andy&apos;s (Chez Andy&apos;s) — SAS</li>
            <li><strong>SIREN :</strong> 938 321 536</li>
            <li><strong>Adresse :</strong> 3 rue Mairie Annexe, Poroani — 97620 Chirongui, Mayotte</li>
            <li><strong>Email :</strong> <a href="mailto:contact@chezandys.com" className="text-primary-700 underline">contact@chezandys.com</a></li>
            <li><strong>Téléphone :</strong> +33 672 75 84 78</li>
          </ul>
        </Section>

        <Section title="2. Données collectées">
          <h3 className="font-semibold text-primary-800 mb-2">2.1 Formulaire de réservation</h3>
          <p>Lors d&apos;une réservation, nous collectons :</p>
          <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
            <li>Nom et prénom</li>
            <li>Adresse email</li>
            <li>Numéro de téléphone</li>
            <li>Date et créneau de retrait souhaités</li>
            <li>Liste des produits réservés et montant indicatif</li>
          </ul>

          <h3 className="font-semibold text-primary-800 mt-5 mb-2">2.2 Formulaire de contact</h3>
          <p>Lors d&apos;un contact, nous collectons :</p>
          <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
            <li>Nom</li>
            <li>Adresse email</li>
            <li>Sujet et contenu du message</li>
          </ul>

          <h3 className="font-semibold text-primary-800 mt-5 mb-2">2.3 Données techniques</h3>
          <p>Lors de votre navigation, des données techniques peuvent être collectées automatiquement : adresse IP (à des fins de protection contre les abus), type de navigateur, pages visitées. Ces données sont utilisées exclusivement à des fins de sécurité et ne sont pas croisées avec vos données personnelles.</p>
        </Section>

        <Section title="3. Finalités du traitement">
          <table className="w-full text-sm border-collapse mt-2">
            <thead>
              <tr className="bg-stone-50">
                <th className="text-left px-3 py-2 font-semibold text-stone-700 border border-stone-100">Finalité</th>
                <th className="text-left px-3 py-2 font-semibold text-stone-700 border border-stone-100">Base légale</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Gestion des réservations et commandes', 'Exécution du contrat'],
                ['Envoi des emails de confirmation', 'Exécution du contrat'],
                ['Réponse aux messages de contact', 'Intérêt légitime'],
                ['Établissement des factures', 'Obligation légale'],
                ['Protection contre les abus (rate limiting)', 'Intérêt légitime'],
              ].map(([f, b], i) => (
                <tr key={i} className={i % 2 === 0 ? '' : 'bg-stone-50/50'}>
                  <td className="px-3 py-2 border border-stone-100">{f}</td>
                  <td className="px-3 py-2 border border-stone-100 text-stone-500">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section title="4. Durée de conservation">
          <ul className="space-y-2 text-sm">
            <li className="flex gap-3"><span className="text-primary-500 shrink-0">▸</span><span><strong>Données de réservation et factures :</strong> 10 ans (obligation comptable et fiscale)</span></li>
            <li className="flex gap-3"><span className="text-primary-500 shrink-0">▸</span><span><strong>Messages de contact :</strong> 3 ans à compter du dernier contact</span></li>
            <li className="flex gap-3"><span className="text-primary-500 shrink-0">▸</span><span><strong>Logs techniques (IP) :</strong> 12 mois maximum</span></li>
            <li className="flex gap-3"><span className="text-primary-500 shrink-0">▸</span><span><strong>Cookie de session (panier) :</strong> Durée de la session navigateur</span></li>
            <li className="flex gap-3"><span className="text-primary-500 shrink-0">▸</span><span><strong>Cookie de session admin :</strong> 8 heures</span></li>
          </ul>
        </Section>

        <Section title="5. Destinataires des données">
          <p>Vos données personnelles sont traitées par Andy&apos;s uniquement. Elles ne sont pas vendues, louées ou cédées à des tiers.</p>
          <p className="mt-3">Elles peuvent être transmises à des sous-traitants techniques dans le strict cadre de l&apos;exécution du service :</p>
          <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
            <li><strong>Vercel Inc.</strong> — hébergement du site (USA, clauses contractuelles types UE)</li>
            <li><strong>Neon Inc.</strong> — hébergement base de données (USA, clauses contractuelles types UE)</li>
            <li><strong>Fournisseur SMTP</strong> — envoi des emails de confirmation</li>
          </ul>
        </Section>

        <Section title="6. Vos droits (RGPD)">
          <p>Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits suivants sur vos données :</p>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              ['Droit d\'accès', 'obtenir une copie des données vous concernant'],
              ['Droit de rectification', 'corriger des données inexactes ou incomplètes'],
              ['Droit à l\'effacement', 'demander la suppression de vos données (sous réserve des obligations légales)'],
              ['Droit à la limitation', 'limiter le traitement de vos données dans certains cas'],
              ['Droit d\'opposition', 'vous opposer au traitement de vos données pour motif légitime'],
              ['Droit à la portabilité', 'recevoir vos données dans un format structuré et lisible'],
            ].map(([droit, desc]) => (
              <li key={droit} className="flex gap-3">
                <span className="text-primary-500 shrink-0 font-semibold">▸</span>
                <span><strong>{droit} :</strong> {desc}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">Pour exercer vos droits, contactez-nous à :</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>Email : <a href="mailto:contact@chezandys.com" className="text-primary-700 underline">contact@chezandys.com</a></li>
            <li>Courrier : Andy&apos;s — 3 rue Mairie Annexe, Poroani, 97620 Chirongui, Mayotte</li>
          </ul>
          <p className="mt-3">Vous avez également le droit d&apos;introduire une réclamation auprès de la <strong>CNIL</strong> (Commission Nationale de l&apos;Informatique et des Libertés) : <a href="https://www.cnil.fr" className="text-primary-700 underline" target="_blank" rel="noopener noreferrer">www.cnil.fr</a></p>
        </Section>

        <Section title="7. Sécurité">
          <p>Andy&apos;s met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre tout accès non autorisé, modification, divulgation ou destruction :</p>
          <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
            <li>Connexion sécurisée HTTPS (TLS)</li>
            <li>Sessions administrateur sécurisées via HMAC SHA-256</li>
            <li>Cookies httpOnly et SameSite</li>
            <li>Limitation du taux de requêtes (rate limiting)</li>
          </ul>
        </Section>

        <Section title="8. Cookies" id="cookies">
          <p>Un cookie est un petit fichier texte déposé sur votre appareil lors de la visite d&apos;un site web.</p>

          <h3 className="font-semibold text-primary-800 mt-4 mb-2">Cookies utilisés sur ce site</h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-stone-50">
                <th className="text-left px-3 py-2 font-semibold text-stone-700 border border-stone-100">Nom</th>
                <th className="text-left px-3 py-2 font-semibold text-stone-700 border border-stone-100">Type</th>
                <th className="text-left px-3 py-2 font-semibold text-stone-700 border border-stone-100">Durée</th>
                <th className="text-left px-3 py-2 font-semibold text-stone-700 border border-stone-100">Finalité</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['cart (localStorage)', 'Fonctionnel', 'Session', 'Mémorisation du panier'],
                ['admin_session', 'Technique', '8 heures', 'Session administrateur sécurisée'],
                ['cookie_consent', 'Préférence', '12 mois', 'Mémorisation de votre choix cookies'],
              ].map(([nom, type, duree, fin], i) => (
                <tr key={i} className={i % 2 === 0 ? '' : 'bg-stone-50/50'}>
                  <td className="px-3 py-2 border border-stone-100 font-mono text-xs">{nom}</td>
                  <td className="px-3 py-2 border border-stone-100">{type}</td>
                  <td className="px-3 py-2 border border-stone-100">{duree}</td>
                  <td className="px-3 py-2 border border-stone-100 text-stone-500">{fin}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-sm text-emerald-800">
            <strong>Aucun cookie publicitaire ou de traçage tiers</strong> (Google Analytics, Facebook Pixel, etc.) n&apos;est utilisé sur ce site.
          </div>

          <h3 className="font-semibold text-primary-800 mt-5 mb-2">Gérer les cookies</h3>
          <p>Vous pouvez à tout moment modifier vos préférences cookies via le bandeau affiché en bas de page, ou en configurant votre navigateur :</p>
          <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
            <li><a href="https://support.google.com/chrome/answer/95647" className="text-primary-700 underline" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/fr/kb/protection-renforcee-contre-le-pistage-firefox" className="text-primary-700 underline" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" className="text-primary-700 underline" target="_blank" rel="noopener noreferrer">Apple Safari</a></li>
          </ul>
          <p className="mt-3 text-xs text-stone-500">Note : désactiver certains cookies techniques peut altérer le fonctionnement du panier et de la réservation.</p>
        </Section>

        <Section title="9. Modifications">
          <p>Andy&apos;s se réserve le droit de modifier la présente politique à tout moment. La date de dernière mise à jour figure en haut de cette page. En continuant à utiliser le site après modification, vous acceptez la politique mise à jour.</p>
        </Section>

        <div className="pt-4 border-t border-stone-100 flex gap-6 text-sm">
          <Link href="/mentions-legales" className="text-primary-700 underline hover:text-primary-900">Mentions légales</Link>
          <Link href="/cgv" className="text-primary-700 underline hover:text-primary-900">CGV</Link>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children, id }) {
  return (
    <div id={id}>
      <h2 className="font-serif font-semibold text-primary-800 text-xl mb-4 pb-2 border-b border-stone-100">{title}</h2>
      <div className="text-sm leading-relaxed space-y-2">{children}</div>
    </div>
  )
}
