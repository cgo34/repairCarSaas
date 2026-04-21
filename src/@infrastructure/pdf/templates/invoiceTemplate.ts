import { getCompanyProfile } from '@/@presentation/composables/useCompanyProfile';
import { InvoiceDto } from '@/@application/dtos/InvoiceDto';
import { LineItemDto } from '@/@application/dtos/LineItemDto';

export const buildInvoiceHtmlTemplate = (invoice: InvoiceDto, lines: LineItemDto[]): string => {
  const company = getCompanyProfile();

  const totalHT = lines.reduce((sum, l) => sum + l.price, 0);
  const totalStripping = lines.reduce((sum, l) => sum + (l.dentRemovalPrice ?? 0), 0);
  const taxRate = invoice.country === 'CH' ? 0.08 : 0;
  const tva = (totalHT + totalStripping) * taxRate;
  const totalTTC = totalHT + totalStripping + tva;
  const currencySymbol = invoice.currency === 'EUR' ? '€' : invoice.currency;

  const garageName   = invoice.garage?.name    ?? invoice.garageName    ?? '';
  const garageAddr   = invoice.garage?.address ?? invoice.garageAddress ?? '';
  const garageZip    = invoice.garage?.zipCode ?? invoice.garageZipCode ?? '';
  const garageCity   = invoice.garage?.city    ?? invoice.garageCity    ?? '';

  const dueDate = (() => {
    const d = new Date(invoice.startDate);
    d.setDate(d.getDate() + (company.paymentDelay ?? 30));
    return d.toLocaleDateString('fr-FR');
  })();

  const companyDisplay = company.companyName || 'Votre entreprise';

  const linesHtml = invoice.isForfait
    ? `<tr><td colspan="4" style="padding:10px 12px;font-style:italic;">Réparation forfaitaire</td></tr>`
    : lines.map(line => `
        <tr>
          <td>${line.bodyPart?.name || '-'}</td>
          <td style="text-align:center;">${(line.impactCount25 ?? 0) + (line.impactCount35 ?? 0)}</td>
          <td>${line.repairType?.name || '-'}</td>
          <td class="amount">${line.price.toFixed(2)} ${currencySymbol}</td>
        </tr>
      `).join('');

  const totalsHtml = invoice.isForfait
    ? `<tr class="total-final"><td class="label">Total TTC</td><td class="amount">${invoice.forfaitAmount.toFixed(2)} ${currencySymbol}</td></tr>`
    : `
      <tr><td class="label">Total H.T.</td><td class="amount">${totalHT.toFixed(2)} ${currencySymbol}</td></tr>
      <tr><td class="label">Dégarnissage</td><td class="amount">${totalStripping.toFixed(2)} ${currencySymbol}</td></tr>
      <tr><td class="label">Base H.T.</td><td class="amount">${(totalHT + totalStripping).toFixed(2)} ${currencySymbol}</td></tr>
      <tr><td class="label">TVA (${taxRate * 100}%)</td><td class="amount">${tva.toFixed(2)} ${currencySymbol}</td></tr>
      <tr class="total-final"><td class="label">Total TTC</td><td class="amount">${totalTTC.toFixed(2)} ${currencySymbol}</td></tr>
    `;

  const ibanLine  = company.iban ? `<span>IBAN : ${company.iban}${company.bic ? ' — BIC : ' + company.bic : ''}</span>` : '';
  const siretLine = company.siret ? `<span>SIRET : ${company.siret}</span>` : '';
  const tvaLine   = company.tvaNumber ? `<span>TVA : ${company.tvaNumber}</span>` : '';
  const penaltyLine = `<span>Pénalités de retard : ${company.latePaymentPenalty || '3 fois le taux légal'}. Indemnité forfaitaire de recouvrement : ${company.recoveryFee || '40 €'}.</span>`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <title>Facture ${invoice.invoiceNumber}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #fff; }

    .page {
      width: 794px;
      min-height: 1122px;
      display: flex;
      flex-direction: column;
      background: #fff;
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 13px;
      color: #1a1a2e;
    }

    /* ── Header ── */
    .header {
      background: #1a1a2e;
      color: #fff;
      padding: 28px 40px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .header-company { max-width: 55%; }
    .header-company .name { font-size: 22px; font-weight: 700; letter-spacing: 0.5px; margin: 0 0 4px; }
    .header-company .tagline { font-size: 11px; opacity: 0.7; margin: 0; }
    .header-company .coords { font-size: 11px; opacity: 0.85; margin-top: 10px; line-height: 1.6; }
    .header-doc { text-align: right; }
    .header-doc .doc-type {
      font-size: 26px; font-weight: 800; letter-spacing: 1px;
      color: #7c5cbf; margin: 0 0 8px;
    }
    .header-doc .meta { font-size: 12px; opacity: 0.85; line-height: 1.8; }
    .header-doc .meta strong { color: #fff; }

    /* ── Infos ── */
    .info-section {
      display: flex;
      gap: 16px;
      padding: 20px 40px;
      border-bottom: 2px solid #f0f0f5;
    }
    .info-box {
      flex: 1;
      background: #f7f7fb;
      border-radius: 8px;
      padding: 14px 16px;
    }
    .info-box .box-title {
      font-size: 10px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.8px; color: #7c5cbf; margin-bottom: 8px;
    }
    .info-box p { margin: 2px 0; font-size: 12px; color: #333; line-height: 1.5; }
    .info-box p strong { color: #1a1a2e; }

    /* ── Tableau lignes ── */
    .content { flex: 1; padding: 24px 40px; }
    .section-title {
      font-size: 11px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.8px; color: #7c5cbf;
      margin-bottom: 10px; padding-bottom: 6px;
      border-bottom: 2px solid #7c5cbf;
    }

    .lines-table { width: 100%; border-collapse: collapse; }
    .lines-table thead tr { background: #1a1a2e; }
    .lines-table thead th {
      color: #fff; font-size: 11px; font-weight: 600;
      text-transform: uppercase; letter-spacing: 0.5px;
      padding: 10px 12px; text-align: left;
    }
    .lines-table thead th.right { text-align: right; }
    .lines-table tbody tr { border-bottom: 1px solid #f0f0f5; }
    .lines-table tbody tr:nth-child(even) { background: #f9f9fc; }
    .lines-table tbody td { padding: 9px 12px; font-size: 12px; vertical-align: middle; }
    .lines-table .amount { text-align: right; font-weight: 500; }

    /* ── Totaux ── */
    .totals-wrapper { display: flex; justify-content: flex-end; margin-top: 20px; }
    .totals-table { width: 300px; border-collapse: collapse; }
    .totals-table td { padding: 6px 12px; font-size: 12px; }
    .totals-table td.label { color: #555; }
    .totals-table td.amount { text-align: right; font-weight: 500; color: #1a1a2e; }
    .totals-table tr.total-final { border-top: 2px solid #1a1a2e; }
    .totals-table tr.total-final td { font-size: 14px; font-weight: 700; padding-top: 10px; }
    .totals-table tr.total-final td.amount { color: #7c5cbf; }

    /* ── Note TVA ── */
    .tva-note {
      margin-top: 16px; font-size: 10px; color: #888;
      font-style: italic; border-top: 1px dashed #ddd; padding-top: 10px;
    }

    /* ── Pied de page ── */
    .footer {
      background: #f7f7fb;
      border-top: 2px solid #1a1a2e;
      padding: 16px 40px;
      display: flex;
      justify-content: space-between;
      gap: 20px;
    }
    .footer-block { flex: 1; }
    .footer-block .footer-title {
      font-size: 10px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.6px; color: #7c5cbf; margin-bottom: 6px;
    }
    .footer-block p { margin: 2px 0; font-size: 10px; color: #444; line-height: 1.5; }
    .footer-signature {
      margin-top: 6px; font-size: 10px; color: #888;
      border-top: 1px solid #ccc; padding-top: 6px;
    }
    .legal-mentions {
      padding: 10px 40px;
      font-size: 9.5px; color: #aaa; line-height: 1.6;
      display: flex; flex-direction: column; gap: 2px;
    }
  </style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div class="header">
    <div class="header-company">
      <p class="name">${companyDisplay}</p>
      <p class="tagline">Débosselage sans peinture</p>
      <div class="coords">
        <div>${company.address || ''}</div>
        <div>${company.zipCode || ''} ${company.city || ''}</div>
        ${company.phone ? `<div>${company.phone}</div>` : ''}
        ${company.email ? `<div>${company.email}</div>` : ''}
      </div>
    </div>
    <div class="header-doc">
      <p class="doc-type">FACTURE</p>
      <div class="meta">
        <div><strong>N°</strong> ${invoice.invoiceNumber}</div>
        <div><strong>Date</strong> ${new Date(invoice.startDate).toLocaleDateString('fr-FR')}</div>
        <div><strong>Échéance</strong> ${dueDate}</div>
      </div>
    </div>
  </div>

  <!-- Blocs véhicule + client -->
  <div class="info-section">
    <div class="info-box">
      <div class="box-title">🚗 Véhicule</div>
      <p><strong>Marque / Modèle</strong> ${invoice.carBrand || '-'}</p>
      <p><strong>Immatriculation</strong> ${invoice.carImmatriculation || '-'}</p>
      <p><strong>Année</strong> ${invoice.carDate || '-'}</p>
    </div>
    <div class="info-box">
      <div class="box-title">🏢 Client</div>
      <p><strong>${garageName}</strong></p>
      <p>${garageAddr}</p>
      <p>${garageZip} ${garageCity}</p>
    </div>
    <div class="info-box">
      <div class="box-title">👤 Technicien</div>
      <p><strong>${invoice.technician?.fullName || ''}</strong></p>
      <p>${invoice.technician?.address || ''}</p>
      <p>${invoice.technician?.zipCode || ''} ${invoice.technician?.city || ''}</p>
    </div>
  </div>

  <!-- Lignes -->
  <div class="content">
    <div class="section-title">Détail des interventions</div>
    <table class="lines-table">
      <thead>
        <tr>
          <th>Élément</th>
          <th style="text-align:center;">Impacts</th>
          <th>Type de réparation</th>
          <th class="right">Prix H.T.</th>
        </tr>
      </thead>
      <tbody>${linesHtml}</tbody>
    </table>

    <div class="totals-wrapper">
      <table class="totals-table">
        <tbody>${totalsHtml}</tbody>
      </table>
    </div>

    <p class="tva-note">
      TVA ${taxRate > 0 ? taxRate * 100 + '%' : 'non applicable'} —
      ${taxRate === 0
        ? 'Autoliquidation de la TVA par le client (Art. 196 directive 2006/112/CE).'
        : 'Assujetti à la TVA en Suisse.'}
    </p>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-block">
      <div class="footer-title">Émetteur</div>
      <p>${invoice.technician?.fullName || ''}</p>
      ${invoice.technician?.taxNumber ? `<p>N° fiscal : ${invoice.technician.taxNumber}</p>` : ''}
      ${ibanLine ? `<p>${company.iban}</p>${company.bic ? `<p>BIC : ${company.bic}</p>` : ''}` : ''}
    </div>
    <div class="footer-block">
      <div class="footer-title">Conditions</div>
      <p>Paiement sous ${company.paymentDelay ?? 30} jours</p>
      <p>Pénalités : ${company.latePaymentPenalty || '3× taux légal'}</p>
      <p>Indemnité recouvrement : ${company.recoveryFee || '40 €'}</p>
    </div>
    <div class="footer-block" style="text-align:right;">
      <div class="footer-title">Signature client</div>
      <div class="footer-signature">
        <p>Bon pour accord</p>
        <p style="margin-top:30px;color:#ccc;">Cachet &amp; Signature</p>
      </div>
    </div>
  </div>

  <!-- Mentions légales -->
  <div class="legal-mentions">
    ${siretLine}${siretLine && tvaLine ? ' — ' : ''}${tvaLine}
    ${company.legalForm && company.capital ? `<span>${company.legalForm} au capital de ${company.capital} — RCS ${company.city} ${company.siren}</span>` : ''}
    ${penaltyLine}
  </div>

</div>
</body>
</html>`;
};
