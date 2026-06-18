import { CompanySettingsDto } from '@/@application/dtos/CompanySettingsDto';
import { LineItemDto } from '@/@application/dtos/LineItemDto';
import { QuoteDto } from '@/@application/dtos/QuoteDto';

export const buildQuoteHtmlTemplate = (quote: QuoteDto, lines: LineItemDto[], company: CompanySettingsDto | null): string => {
  const c = company ?? {} as Partial<CompanySettingsDto>;

  const totalHT = lines.reduce((sum, l) => sum + l.price, 0);
  const totalStripping = lines.reduce((sum, l) => sum + (l.dentRemovalPrice ?? 0), 0);
  const taxRate = quote.country === 'CH' ? 0.08 : 0;
  const tva = (totalHT + totalStripping) * taxRate;
  const totalTTC = totalHT + totalStripping + tva;
  const currencySymbol = quote.currency === 'EUR' ? '€' : (quote.currency ?? 'EUR');

  const quoteDate = new Date(quote.startDate).toLocaleDateString('fr-FR');
  const validUntil = (() => {
    const d = new Date(quote.startDate);
    d.setDate(d.getDate() + 30);
    return d.toLocaleDateString('fr-FR');
  })();

  const companyDisplay = c.companyName || 'Votre entreprise';

  const linesHtml = quote.isForfait
    ? `<tr>
        <td colspan="3" style="padding:10px 14px;font-style:italic;">Réparation forfaitaire</td>
        <td class="right">${(quote.forfaitAmount ?? 0).toFixed(2)} ${currencySymbol}</td>
      </tr>`
    : lines.map(line => `
        <tr>
          <td>${line.bodyPart?.name || '-'}</td>
          <td class="center">${(line.impactCount25 ?? 0) + (line.impactCount35 ?? 0)}</td>
          <td>${line.repairType?.name || '-'}</td>
          <td class="right">${line.price.toFixed(2)} ${currencySymbol}</td>
        </tr>
      `).join('');

  const totalsHtml = quote.isForfait
    ? `<tr class="final-row">
        <td>Total</td>
        <td class="right">${(quote.forfaitAmount ?? 0).toFixed(2)} ${currencySymbol}</td>
      </tr>`
    : `
      <tr class="sub-row">
        <td>Total H.T.</td>
        <td class="right">${totalHT.toFixed(2)} ${currencySymbol}</td>
      </tr>
      <tr class="sub-row">
        <td>Dégarnissage</td>
        <td class="right">${totalStripping.toFixed(2)} ${currencySymbol}</td>
      </tr>
      <tr class="sub-row">
        <td>Base H.T.</td>
        <td class="right">${(totalHT + totalStripping).toFixed(2)} ${currencySymbol}</td>
      </tr>
      ${taxRate > 0 ? `<tr class="sub-row"><td>TVA (${taxRate * 100}%)</td><td class="right">${tva.toFixed(2)} ${currencySymbol}</td></tr>` : ''}
      <tr class="final-row">
        <td>Total TTC</td>
        <td class="right">${totalTTC.toFixed(2)} ${currencySymbol}</td>
      </tr>
    `;

  const tvaNote = taxRate > 0
    ? `TVA ${taxRate * 100}% — Assujetti à la TVA en Suisse.`
    : `TVA non applicable — Autoliquidation de la TVA par le client (Article 196 de la directive 2006/112/CE)`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <title>Devis ${quote.quoteNumber}</title>
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

    .header {
      background: #1a1a2e;
      color: #fff;
      padding: 22px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-logo {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: 1px;
      color: #fff;
    }
    .header-doc { text-align: right; }
    .header-doc .doc-type {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: 2px;
      color: #fff;
      margin: 0 0 4px;
    }
    .header-doc .meta {
      font-size: 12px;
      opacity: 0.85;
      line-height: 1.8;
    }

    .content { flex: 1; padding: 28px 40px; }

    /* SOCIÉTÉ | VÉHICULE | CLIENT — 3 colonnes */
    .parties-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 22px;
    }
    .parties-table .th-cell {
      background: #1a1a2e;
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      padding: 7px 12px;
      width: 33.33%;
    }
    .parties-table .td-cell {
      padding: 11px 12px;
      vertical-align: top;
      border: 1px solid #ddd;
      border-top: none;
      font-size: 11.5px;
      line-height: 1.6;
      width: 33.33%;
    }
    .parties-table .td-cell .party-name {
      font-size: 12.5px;
      font-weight: 700;
      margin-bottom: 3px;
    }
    .parties-table .td-cell .party-line { color: #444; }
    .parties-table .td-cell .party-legal {
      margin-top: 6px;
      color: #666;
      font-size: 10.5px;
    }
    .parties-table .td-cell .vehicle-row {
      display: flex;
      gap: 6px;
      margin-bottom: 2px;
    }
    .parties-table .td-cell .vehicle-label {
      color: #888;
      font-size: 10.5px;
      min-width: 90px;
    }
    .parties-table .td-cell .vehicle-value {
      font-weight: 500;
      font-size: 11.5px;
    }

    /* Lignes */
    .lines-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .lines-table thead tr { background: #1a1a2e; }
    .lines-table thead th {
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 9px 14px;
      text-align: left;
    }
    .lines-table thead th.center { text-align: center; }
    .lines-table thead th.right  { text-align: right; }
    .lines-table tbody tr { border-bottom: 1px solid #eee; }
    .lines-table tbody tr:nth-child(even) { background: #f9f9fc; }
    .lines-table tbody td { padding: 10px 14px; font-size: 12px; }
    .lines-table td.center { text-align: center; }
    .lines-table td.right  { text-align: right; font-weight: 500; }

    /* Totaux */
    .totals-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
    }
    .totals-table .th-row td {
      background: #1a1a2e;
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 9px 14px;
    }
    .totals-table .th-row td.right { text-align: right; }
    .totals-table .sub-row td {
      padding: 7px 14px;
      font-size: 12px;
      border-bottom: 1px solid #eee;
      color: #555;
    }
    .totals-table .sub-row td.right { text-align: right; font-weight: 500; color: #1a1a2e; }
    .totals-table .final-row td {
      padding: 10px 14px;
      font-size: 14px;
      font-weight: 700;
      border-top: 2px solid #1a1a2e;
    }
    .totals-table .final-row td.right { text-align: right; }

    .tva-note {
      font-size: 10px;
      color: #888;
      font-style: italic;
      margin-top: 4px;
      margin-bottom: 0;
    }

    /* Footer */
    .footer {
      background: #f7f7fb;
      border-top: 2px solid #1a1a2e;
      padding: 20px 40px;
      display: flex;
      gap: 40px;
    }
    .footer-block { flex: 1; }
    .footer-block .footer-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #1a1a2e;
      margin-bottom: 8px;
    }
    .footer-block p { margin: 2px 0; font-size: 11px; color: #444; line-height: 1.6; }

    .footer-signature {
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 10px 14px;
      margin-top: 8px;
      min-height: 60px;
    }
    .footer-signature .sig-label {
      font-size: 10px;
      color: #888;
      margin-bottom: 4px;
    }

    .merci {
      text-align: right;
      padding: 10px 40px 16px;
      font-size: 16px;
      font-weight: 800;
      letter-spacing: 2px;
      color: #1a1a2e;
    }
  </style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div class="header">
    <div class="header-logo">
      ${c.logoUrl ? `<img src="${c.logoUrl}" alt="Logo" style="max-height:50px;max-width:180px;object-fit:contain;vertical-align:middle;margin-right:10px;">` : ''}
      ${companyDisplay}
    </div>
    <div class="header-doc">
      <p class="doc-type">DEVIS</p>
      <div class="meta">
        <div>N° : ${quote.quoteNumber}</div>
        <div>DATE : ${quoteDate}</div>
        <div>VALABLE JUSQU'AU : ${validUntil}</div>
      </div>
    </div>
  </div>

  <div class="content">

    <!-- SOCIÉTÉ | VÉHICULE | CLIENT -->
    <table class="parties-table">
      <tr>
        <td class="th-cell">SOCIÉTÉ</td>
        <td class="th-cell">VÉHICULE</td>
        <td class="th-cell">CLIENT</td>
      </tr>
      <tr>
        <td class="td-cell">
          <div class="party-name">${companyDisplay}</div>
          ${c.address ? `<div class="party-line">${c.address}</div>` : ''}
          ${(c.zipCode || c.city) ? `<div class="party-line">${c.zipCode ?? ''} ${c.city ?? ''}</div>` : ''}
          ${c.phone ? `<div class="party-line">${c.phone}</div>` : ''}
          ${c.email ? `<div class="party-line">${c.email}</div>` : ''}
          ${(c.siret || c.tvaNumber || c.legalForm) ? `<div class="party-legal">
            ${c.siret ? `SIRET : ${c.siret}` : ''}
            ${c.tvaNumber ? `<br>N° TVA : ${c.tvaNumber}` : ''}
            ${c.legalForm ? `<br>${c.legalForm}${c.capital ? ' — Capital : ' + c.capital : ''}` : ''}
          </div>` : ''}
        </td>
        <td class="td-cell">
          <div class="vehicle-row">
            <span class="vehicle-label">Marque / Modèle</span>
            <span class="vehicle-value">${quote.carBrand || '—'}</span>
          </div>
          <div class="vehicle-row">
            <span class="vehicle-label">Immatriculation</span>
            <span class="vehicle-value">${quote.carImmatriculation || '—'}</span>
          </div>
          <div class="vehicle-row">
            <span class="vehicle-label">Année</span>
            <span class="vehicle-value">${quote.carDate || '—'}</span>
          </div>
        </td>
        <td class="td-cell">
          <div class="party-name">${quote.garage?.name || ''}</div>
          ${quote.garage?.address ? `<div class="party-line">${quote.garage.address}</div>` : ''}
          ${(quote.garage?.zipCode || quote.garage?.city) ? `<div class="party-line">${quote.garage?.zipCode ?? ''} ${quote.garage?.city ?? ''}</div>` : ''}
        </td>
      </tr>
    </table>

    <!-- Lignes -->
    <table class="lines-table">
      <thead>
        <tr>
          <th>ÉLÉMENT</th>
          <th class="center">IMPACTS</th>
          <th>TYPE DE RÉPARATION</th>
          <th class="right">PRIX H.T.</th>
        </tr>
      </thead>
      <tbody>${linesHtml}</tbody>
    </table>

    <!-- Totaux -->
    <table class="totals-table">
      <tr class="th-row">
        <td>DÉTAILS DES TOTAUX</td>
        <td class="right">MONTANT</td>
      </tr>
      ${totalsHtml}
    </table>

    <p class="tva-note">${tvaNote}</p>

  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-block">
      <div class="footer-title">Informations de paiement</div>
      ${c.companyName ? `<p>Nom : ${c.companyName}</p>` : ''}
      ${c.iban ? `<p>IBAN : ${c.iban}</p>` : ''}
      ${c.bic  ? `<p>Swift/BIC : ${c.bic}</p>` : ''}
      ${!c.iban ? `<p style="color:#aaa;font-style:italic;">À compléter dans les paramètres</p>` : ''}
    </div>
    <div class="footer-block">
      <div class="footer-title">Terme et conditions</div>
      <p>Ce devis est valable 30 jours à compter de sa date d'émission.</p>
      <p>Le paiement devra être effectué dans un délai de ${c.paymentDelay ?? 30} jours.</p>
      ${c.latePaymentPenalty ? `<p>Pénalités de retard : ${c.latePaymentPenalty}.</p>` : ''}
    </div>
    <div class="footer-block">
      <div class="footer-title">Bon pour accord</div>
      <div class="footer-signature">
        <div class="sig-label">Date :</div>
        <div class="sig-label" style="margin-top:20px;">Cachet &amp; Signature :</div>
      </div>
    </div>
  </div>

  <div class="merci">MERCI</div>

</div>
</body>
</html>`;
};
