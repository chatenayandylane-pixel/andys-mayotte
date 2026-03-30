import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: "Conditions Générales de Vente — Chez Andy's",
  description: "Conditions Générales de Vente de Chez Andy's, grossiste alimentaire à Poroani, Mayotte.",
}

export default function CGVPage() {
  return (
    <div className="bg-white min-h-screen">

      {/* En-tête */}
      <div className="bg-primary-900 py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm mb-6 transition-colors">
            <ArrowLeft size={14} /> Retour à l&apos;accueil
          </Link>
          <h1 className="font-serif font-semibold text-white text-3xl md:text-4xl">Conditions Générales de Vente</h1>
          <p className="text-stone-400 text-sm mt-2">Dernière mise à jour : mars 2025 — Version 1.0</p>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16 space-y-10 text-stone-700">

        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-sm text-amber-800">
          <strong>Important :</strong> En passant une réservation sur ce site, vous acceptez sans réserve les présentes Conditions Générales de Vente.
        </div>

        <Section title="1. Objet">
          <p>Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre la société <strong>Andy&apos;s (Chez Andy&apos;s)</strong>, SAS au capital variable, immatriculée au RCS de Mamoudzou sous le numéro 938 321 536, dont le siège social est situé au 3 rue Mairie Annexe, Poroani, Quartier 100 Villas — 97620 Chirongui, Mayotte (ci-après « le Vendeur »), et toute personne physique ou morale souhaitant procéder à une réservation via le site <strong>chezandys.com</strong> (ci-après « le Client »).</p>
        </Section>

        <Section title="2. Produits et services">
          <p>Andy&apos;s est un grossiste alimentaire proposant à la vente des produits alimentaires (boissons, épicerie, conserves, céréales, etc.) destinés aux professionnels et particuliers.</p>
          <p className="mt-2">Le service proposé sur le site est un service de <strong>réservation en ligne avec retrait en magasin</strong>. Le Client sélectionne ses produits, réserve un créneau de retrait, puis se présente en magasin à l&apos;heure convenue pour récupérer sa commande et procéder au paiement.</p>
          <p className="mt-2">Les photographies et descriptions des produits présentés sur le site sont fournies à titre indicatif. Andy&apos;s s&apos;efforce d&apos;assurer leur exactitude mais ne saurait être tenu responsable d&apos;éventuelles erreurs ou omissions.</p>
        </Section>

        <Section title="3. Prix">
          <p>Les prix affichés sur le site sont indiqués en euros (€) <strong>toutes taxes comprises (TTC)</strong>, sauf mention contraire.</p>
          <p className="mt-2">Andy&apos;s se réserve le droit de modifier ses prix à tout moment. Les prix en vigueur au moment de la réservation sont ceux qui s&apos;appliquent.</p>
          <p className="mt-2">Le total affiché lors de la réservation est un <strong>montant indicatif</strong>. Le prix définitif est arrêté lors du retrait en magasin, en fonction des quantités effectivement disponibles et remises au Client.</p>
        </Section>

        <Section title="4. Réservation">
          <h3 className="font-semibold text-primary-800 mt-3 mb-1">4.1 Processus de réservation</h3>
          <p>Le Client sélectionne les produits souhaités dans le catalogue en ligne, les ajoute à son panier, puis remplit le formulaire de réservation en indiquant ses coordonnées et un créneau de retrait disponible.</p>
          <p className="mt-2">La réservation est confirmée par l&apos;envoi d&apos;un email de confirmation à l&apos;adresse fournie par le Client.</p>

          <h3 className="font-semibold text-primary-800 mt-4 mb-1">4.2 Disponibilité des produits</h3>
          <p>Les produits sont proposés dans la limite des stocks disponibles. En cas d&apos;indisponibilité partielle ou totale d&apos;un produit après réservation, Andy&apos;s en informera le Client lors du retrait ou par email dans les meilleurs délais.</p>

          <h3 className="font-semibold text-primary-800 mt-4 mb-1">4.3 Annulation</h3>
          <p>Le Client peut annuler ou modifier sa réservation en contactant Andy&apos;s par téléphone (+33 672 75 84 78) ou par email (contact@chezandys.com) au moins <strong>2 heures avant le créneau de retrait</strong>.</p>
        </Section>

        <Section title="5. Retrait en magasin">
          <p>Le retrait des commandes s&apos;effectue exclusivement <strong>en magasin</strong>, à l&apos;adresse suivante :</p>
          <address className="mt-2 not-italic text-sm bg-stone-50 rounded-xl p-4 border border-stone-100">
            Chez Andy&apos;s<br />
            3 rue Mairie Annexe, Poroani<br />
            Quartier 100 Villas — 97620 Chirongui<br />
            Mayotte (976)
          </address>
          <p className="mt-3">Le Client est invité à se présenter au créneau horaire choisi lors de la réservation. En cas de retard, Andy&apos;s ne saurait être tenu responsable de l&apos;indisponibilité des produits réservés.</p>
          <p className="mt-2">Les horaires d&apos;ouverture sont du <strong>lundi au samedi de 8h00 à 18h00</strong> (sous réserve des jours fériés et fermetures exceptionnelles).</p>
        </Section>

        <Section title="6. Paiement">
          <p>Le paiement s&apos;effectue <strong>exclusivement sur place</strong>, au moment du retrait de la commande. Aucun paiement en ligne n&apos;est requis ou proposé sur ce site.</p>
          <p className="mt-2">Les modes de paiement acceptés en magasin sont :</p>
          <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
            <li>Espèces</li>
            <li>Chèque bancaire (à l&apos;ordre d&apos;Andy&apos;s)</li>
          </ul>
          <p className="mt-3">Andy&apos;s se réserve le droit de refuser tout moyen de paiement non listé ci-dessus.</p>
        </Section>

        <Section title="7. Droit de rétractation">
          <p>Conformément à l&apos;article L221-28 du Code de la consommation, <strong>le droit de rétractation ne s&apos;applique pas</strong> aux denrées alimentaires périssables ou à conservation limitée.</p>
          <p className="mt-2">Pour les produits non périssables, le Client peut refuser la remise d&apos;un article au moment du retrait en magasin si celui-ci ne correspond pas à sa commande ou est endommagé. Le montant correspondant sera alors déduit de la facture.</p>
        </Section>

        <Section title="8. Responsabilité">
          <p>Andy&apos;s ne saurait être tenu responsable :</p>
          <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
            <li>De l&apos;impossibilité d&apos;accéder au site en raison de problèmes techniques</li>
            <li>De l&apos;indisponibilité d&apos;un produit réservé suite à une rupture de stock imprévue</li>
            <li>De tout préjudice indirect lié à l&apos;utilisation du service de réservation en ligne</li>
          </ul>
          <p className="mt-3">La responsabilité d&apos;Andy&apos;s ne pourra en aucun cas être engagée pour un montant supérieur au montant de la commande concernée.</p>
        </Section>

        <Section title="9. Protection des données personnelles">
          <p>Les données collectées lors de la réservation (nom, prénom, téléphone, email) sont traitées conformément au RGPD dans le seul but de gérer la commande et la relation client.</p>
          <p className="mt-2">Pour plus d&apos;informations : <Link href="/politique-confidentialite" className="text-primary-700 underline">Politique de confidentialité</Link>.</p>
        </Section>

        <Section title="10. Litiges et droit applicable">
          <p>Les présentes CGV sont soumises au <strong>droit français</strong>.</p>
          <p className="mt-2">En cas de litige, le Client est invité à contacter Andy&apos;s en premier lieu pour trouver une solution amiable :</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>Par email : <a href="mailto:contact@chezandys.com" className="text-primary-700 underline">contact@chezandys.com</a></li>
            <li>Par téléphone : +33 672 75 84 78</li>
          </ul>
          <p className="mt-3">En cas d&apos;échec de la tentative de résolution amiable, le litige pourra être porté devant les tribunaux compétents du ressort du siège social d&apos;Andy&apos;s.</p>
          <p className="mt-3">Conformément à l&apos;article L612-1 du Code de la consommation, le consommateur peut recourir gratuitement au médiateur de la consommation en vue de la résolution amiable du litige.</p>
        </Section>

        <div className="pt-4 border-t border-stone-100 flex gap-6 text-sm">
          <Link href="/mentions-legales" className="text-primary-700 underline hover:text-primary-900">Mentions légales</Link>
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
