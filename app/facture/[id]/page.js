import { sql } from '@/lib/db'
import { notFound } from 'next/navigation'
import PrintButton from './PrintButton'
import LogoImg from './LogoImg'

export const dynamic = 'force-dynamic'

function formatDate(str) {
  if (!str) return ''
  return new Date(str + 'T00:00:00').toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}

function formatDateTime(str) {
  if (!str) return ''
  return new Date(str).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default async function FacturePage({ params }) {
  const rows = await sql`
    SELECT id,
           reservation_id   AS "reservationId",
           client_nom       AS "clientNom",
           client_prenom    AS "clientPrenom",
           client_email     AS "clientEmail",
           client_telephone AS "clientTelephone",
           articles, total, status,
           created_at AS "createdAt",
           paid_at    AS "paidAt"
    FROM invoices WHERE id = ${params.id}
  `
  const invoice = rows[0]
  if (!invoice) return notFound()

  const total  = parseFloat(invoice.total || 0)
  const isPaid = invoice.status === 'payee'

  return (
    <>
      {/* Barre d'actions — masquée à l'impression */}
      <div className="print:hidden bg-primary-50 border-b border-primary-100 px-6 py-3 flex items-center justify-between gap-4">
        <p className="text-sm text-primary-700 font-medium">
          Facture <span className="font-bold">{invoice.id}</span>
          <span className={`ml-3 text-xs font-semibold px-2 py-0.5 rounded-full ${isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            {isPaid ? 'PAYÉE' : 'EN ATTENTE'}
          </span>
        </p>
        <PrintButton />
      </div>

      {/* Corps de la facture — max-w limité pour ressembler à un document A4 */}
      <div className="max-w-[780px] mx-auto my-10 px-4 print:my-0 print:px-0">
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden print:rounded-none print:border-0 shadow-card print:shadow-none">

          {/* ── En-tête : logo + infos entreprise + numéro facture ── */}
          <div className="px-8 pt-8 pb-6 flex items-start justify-between gap-6 border-b border-stone-100">
            {/* Logo + infos entreprise */}
            <div className="flex items-start gap-4">
              <LogoImg />
              <div>
                <h1 className="font-serif text-xl font-bold text-primary-800">Andy&apos;s Mayotte</h1>
                <p className="text-sm text-stone-500 mt-0.5">Grossiste alimentaire</p>
                <p className="text-sm text-stone-500">3 rue Mairie Annexe, Poroani</p>
                <p className="text-sm text-stone-500">Quartier 100 Villas — 97620 Chirongui</p>
                <p className="text-sm text-stone-500">+33 672 75 84 78</p>
                <p className="text-sm text-stone-500">contact@chezandys.com</p>
              </div>
            </div>

            {/* Numéro + statut facture */}
            <div className="text-right shrink-0">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">Facture</p>
              <p className="text-2xl font-bold text-primary-800">{invoice.id}</p>
              <p className="text-xs text-stone-400 mt-1">Émise le {formatDateTime(invoice.createdAt)}</p>
              {isPaid && invoice.paidAt && (
                <p className="text-xs text-emerald-600 mt-0.5">Payée le {formatDateTime(invoice.paidAt)}</p>
              )}
              <span className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full ${
                isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {isPaid ? 'PAYÉE' : 'EN ATTENTE'}
              </span>
            </div>
          </div>

          <div className="px-8 py-6">

            {/* ── Infos client + détails commande ── */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-stone-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Facturé à</p>
                <p className="font-semibold text-primary-800 text-base">
                  {invoice.clientPrenom} {invoice.clientNom}
                </p>
                {invoice.clientEmail && (
                  <p className="text-sm text-stone-500 mt-1">{invoice.clientEmail}</p>
                )}
                {invoice.clientTelephone && (
                  <p className="text-sm text-stone-500">{invoice.clientTelephone}</p>
                )}
              </div>
              <div className="bg-stone-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Détails retrait</p>
                <p className="text-sm text-stone-600">
                  <span className="font-medium text-stone-700">Réservation :</span> {invoice.reservationId}
                </p>
                {invoice.reservationDate && (
                  <p className="text-sm text-stone-600 mt-1">
                    <span className="font-medium text-stone-700">Date :</span> {formatDate(invoice.reservationDate)}
                  </p>
                )}
                <p className="text-sm text-stone-600 mt-1">
                  <span className="font-medium text-stone-700">Lieu :</span> Andy&apos;s — Poroani, Mayotte
                </p>
              </div>
            </div>

            {/* ── Tableau des articles ── */}
            <div className="border border-stone-100 rounded-xl overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead className="bg-primary-800 text-white">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider">Article</th>
                    <th className="text-center px-4 py-3 font-semibold text-xs uppercase tracking-wider">Qté</th>
                    <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wider">Prix unitaire</th>
                    <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wider">Total HT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {(invoice.articles || []).map((a, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'}>
                      <td className="px-4 py-3">
                        <span className="font-medium text-primary-800">{a.emoji} {a.name}</span>
                        {a.unit && <span className="text-stone-400 ml-1 text-xs">/ {a.unit}</span>}
                      </td>
                      <td className="px-4 py-3 text-center text-stone-600">{a.quantity}</td>
                      <td className="px-4 py-3 text-right text-stone-600">{parseFloat(a.price).toFixed(2)} €</td>
                      <td className="px-4 py-3 text-right font-semibold text-primary-800">
                        {(parseFloat(a.price) * a.quantity).toFixed(2)} €
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Récapitulatif montants ── */}
            <div className="flex justify-end mb-8">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Sous-total HT</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm text-stone-500">
                  <span>TVA (non applicable)</span>
                  <span>0,00 €</span>
                </div>
                <div className="border-t border-stone-200 pt-2 flex justify-between font-bold text-primary-800 text-lg">
                  <span>Total TTC</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            {/* ── Moyen de paiement ── */}
            <div className="bg-primary-50 border border-primary-100 rounded-xl px-5 py-4 mb-8">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Moyen de paiement</p>
              <p className="text-sm text-primary-800 font-medium">
                Paiement en espèces ou par chèque — réglé au moment du retrait en magasin
              </p>
              <p className="text-xs text-stone-400 mt-1">
                Andy&apos;s Mayotte — 3 rue Mairie Annexe, Poroani, 97620 Chirongui
</p>
            </div>

          </div>

          {/* ── Mentions légales — bas de facture ── */}
          <div className="border-t border-stone-100 px-8 py-4 bg-stone-50">
            <p className="text-center text-stone-400" style={{ fontSize: '10px', lineHeight: '1.8' }}>
              Andy&apos;s Mayotte — 3 rue Mairie Annexe, Poroani, Quartier 100 Villas — 97620 Chirongui — +33 672 75 84 78 — contact@chezandys.com<br />
              SAS — SIREN&nbsp;938&nbsp;321&nbsp;536 — Forme juridique&nbsp;: Société par Actions Simplifiée<br />
              N°&nbsp;TVA&nbsp;intracommunautaire&nbsp;: FR79938321536 — RCS&nbsp;938&nbsp;321&nbsp;536&nbsp;R.C.S.&nbsp;Mamoudzou
            </p>
          </div>

        </div>
      </div>
    </>
  )
}
