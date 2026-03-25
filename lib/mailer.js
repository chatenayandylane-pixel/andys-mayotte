import nodemailer from 'nodemailer'

function formatDateFR(str) {
  if (!str) return ''
  return new Date(str + 'T00:00:00').toLocaleDateString('fr-FR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  })
}

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || '587'),
    secure: parseInt(SMTP_PORT || '587') === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
}

export async function sendInvoiceEmail({ to, clientName, invoiceId, reservationDate, creneau, articles, total }) {
  const from = process.env.SMTP_FROM || "Andy's Mayotte <noreply@chezandys.com>"
  const subject = `Votre facture Andy's — ${invoiceId}`

  const rows = articles.map(a => `
    <tr>
      <td style="padding:8px 4px;border-bottom:1px solid #f0f0f0">${a.emoji || ''} ${a.name}</td>
      <td style="padding:8px 4px;border-bottom:1px solid #f0f0f0;text-align:center">${a.quantity} ${a.unit || ''}</td>
      <td style="padding:8px 4px;border-bottom:1px solid #f0f0f0;text-align:right">${(a.price * a.quantity).toFixed(2)} €</td>
    </tr>`).join('')

  const html = `<!DOCTYPE html><html><body style="margin:0;font-family:Arial,sans-serif;background:#f9fafb">
    <div style="max-width:600px;margin:32px auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
      <div style="background:#1c4532;padding:28px 32px">
        <h1 style="margin:0;color:white;font-size:22px">Andy's Mayotte</h1>
        <p style="margin:6px 0 0;color:#6ee7b7;font-size:13px">Grossiste alimentaire — Poroani, Mayotte</p>
      </div>
      <div style="padding:32px">
        <p style="font-size:16px;color:#111">Bonjour <strong>${clientName}</strong>,</p>
        <p style="color:#555;margin-top:0">Votre paiement a été validé. Voici votre facture officielle.</p>
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:24px 0">
          <p style="margin:0;font-size:11px;color:#6b7280;text-transform:uppercase;font-weight:600;letter-spacing:.05em">Facture N°</p>
          <p style="margin:4px 0 8px;font-size:20px;font-weight:700;color:#1c4532">${invoiceId}</p>
          <p style="margin:0;font-size:13px;color:#374151">Retrait : <strong>${reservationDate}</strong> — Créneau : <strong>${creneau}</strong></p>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-top:8px">
          <thead>
            <tr style="background:#f9fafb">
              <th style="padding:8px 4px;text-align:left;font-size:12px;color:#6b7280;text-transform:uppercase">Article</th>
              <th style="padding:8px 4px;text-align:center;font-size:12px;color:#6b7280;text-transform:uppercase">Qté</th>
              <th style="padding:8px 4px;text-align:right;font-size:12px;color:#6b7280;text-transform:uppercase">Montant</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
          <tfoot>
            <tr style="background:#f0fdf4">
              <td colspan="2" style="padding:12px 4px;font-weight:700;font-size:16px;color:#1c4532">Total payé</td>
              <td style="padding:12px 4px;font-weight:700;font-size:16px;color:#1c4532;text-align:right">${total.toFixed(2)} €</td>
            </tr>
          </tfoot>
        </table>
        <p style="margin:32px 0 0;font-size:13px;color:#6b7280;text-align:center">
          Merci pour votre confiance !
        </p>
      </div>
      <div style="padding:14px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center">
        <p style="margin:0;font-size:10px;color:#9ca3af;line-height:1.8">
          Andy's Mayotte — Poroani, Mayotte (976) — contact@chezandys.com<br>
          SAS — SIREN 938 321 536 — Société par Actions Simplifiée<br>
          N° TVA : FR79938321536 — RCS 938 321 536 R.C.S. Mamoudzou
        </p>
      </div>
    </div>
  </body></html>`

  const transporter = getTransporter()
  if (!transporter) {
    console.log(`[EMAIL non configuré] Facture ${invoiceId} → ${to}\nConfigurez .env.local avec SMTP_HOST, SMTP_USER, SMTP_PASS`)
    return { simulated: true }
  }
  return transporter.sendMail({ from, to, subject, html })
}

// ── Email de confirmation à la création de réservation ────────────────────────
export async function sendConfirmationEmail({ to, clientName, reservationId, invoiceId, date, creneau, articles, total }) {
  const from    = process.env.SMTP_FROM || "Chez Andy's <noreply@chezandys.com>"
  const subject = `Confirmation de réservation — ${reservationId}`

  const rows = articles.map(a => `
    <tr>
      <td style="padding:7px 4px;border-bottom:1px solid #f0f0f0">${a.emoji || ''} ${a.name}</td>
      <td style="padding:7px 4px;border-bottom:1px solid #f0f0f0;text-align:center">${a.quantity} ${a.unit || ''}</td>
      <td style="padding:7px 4px;border-bottom:1px solid #f0f0f0;text-align:right">${(a.price * a.quantity).toFixed(2)} €</td>
    </tr>`).join('')

  const html = `<!DOCTYPE html><html><body style="margin:0;font-family:Arial,sans-serif;background:#f9fafb">
    <div style="max-width:600px;margin:32px auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
      <div style="background:#1c4532;padding:28px 32px">
        <h1 style="margin:0;color:white;font-size:22px">Chez Andy's</h1>
        <p style="margin:6px 0 0;color:#6ee7b7;font-size:13px">Grossiste alimentaire — Poroani, Mayotte</p>
      </div>
      <div style="padding:32px">
        <p style="font-size:16px;color:#111">Bonjour <strong>${clientName}</strong>,</p>
        <p style="color:#555;margin-top:0">Votre réservation a bien été enregistrée. Voici le récapitulatif :</p>

        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:20px 0">
          <p style="margin:0 0 4px;font-size:12px;color:#6b7280;text-transform:uppercase;font-weight:600">Date de retrait</p>
          <p style="margin:0;font-size:17px;font-weight:700;color:#1c4532">${formatDateFR(date)}</p>
          <p style="margin:6px 0 0;font-size:14px;color:#374151">Créneau : <strong>${creneau}</strong></p>
          <p style="margin:4px 0 0;font-size:13px;color:#6b7280">Chez Andy's — Poroani, Mayotte (976)</p>
        </div>

        <table style="width:100%;border-collapse:collapse;margin-top:16px">
          <thead>
            <tr style="background:#f9fafb">
              <th style="padding:8px 4px;text-align:left;font-size:12px;color:#6b7280;text-transform:uppercase">Article</th>
              <th style="padding:8px 4px;text-align:center;font-size:12px;color:#6b7280;text-transform:uppercase">Qté</th>
              <th style="padding:8px 4px;text-align:right;font-size:12px;color:#6b7280;text-transform:uppercase">Montant</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
          <tfoot>
            <tr style="background:#f9fafb">
              <td colspan="2" style="padding:10px 4px;font-weight:700;color:#374151">Total indicatif</td>
              <td style="padding:10px 4px;font-weight:700;color:#1c4532;text-align:right">${total.toFixed(2)} €</td>
            </tr>
          </tfoot>
        </table>

        <div style="background:#fef9c3;border:1px solid #fde68a;border-radius:8px;padding:14px;margin:24px 0">
          <p style="margin:0;font-size:13px;color:#92400e">
            <strong>Paiement sur place</strong> — Le règlement s'effectue en espèces ou par chèque au moment du retrait.
          </p>
        </div>

        <p style="font-size:12px;color:#9ca3af">Réservation N° : ${reservationId} — Facture N° : ${invoiceId}</p>
      </div>
      <div style="padding:14px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center">
        <p style="margin:0;font-size:10px;color:#9ca3af;line-height:1.8">
          Chez Andy's — Poroani, Mayotte (976) — contact@chezandys.com<br>
          SAS — SIREN 938 321 536 — N° TVA : FR79938321536 — RCS 938 321 536 R.C.S. Mamoudzou
        </p>
      </div>
    </div>
  </body></html>`

  const transporter = getTransporter()
  if (!transporter) {
    console.log(`[EMAIL non configuré] Confirmation ${reservationId} → ${to}`)
    return { simulated: true }
  }
  return transporter.sendMail({ from, to, subject, html })
}
