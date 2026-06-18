import { CompanySettingsDto } from '@/@application/dtos/CompanySettingsDto';
import { InvoiceDto } from '@/@application/dtos/InvoiceDto';
import { LineItemDto } from '@/@application/dtos/LineItemDto';

export const buildInvoiceHtmlTemplate = (invoice: InvoiceDto, lines: LineItemDto[], company: CompanySettingsDto | null): string => {
  const c = company ?? {} as Partial<CompanySettingsDto>;

  const totalHT = lines.reduce((sum, l) => sum + l.price, 0);
  const totalStripping = lines.reduce((sum, l) => sum + (l.dentRemovalPrice ?? 0), 0);
  const totalBase = totalHT + totalStripping;
  const garageCommissionRate = (invoice.garagePercentageCommission ?? 0) / 100;
  const commissionAmount = garageCommissionRate > 0 ? Math.round(totalBase * garageCommissionRate * 100) / 100 : 0;
  const totalAfterCommission = totalBase - commissionAmount;
  const taxRate = invoice.country === 'CH' ? 0.08 : 0;
  const tva = totalAfterCommission * taxRate;
  const totalTTC = totalAfterCommission + tva;
  const currency = invoice.currency ?? 'EUR';
  const currencySymbol = currency === 'EUR' ? '€' : currency;

  const displayTotal = invoice.isForfait
    ? (() => {
        const raw = invoice.forfaitAmount ?? 0;
        const comm = garageCommissionRate > 0 ? Math.round(raw * garageCommissionRate * 100) / 100 : 0;
        return raw - comm;
      })()
    : totalTTC;

  const invoiceDate = new Date(invoice.startDate).toLocaleDateString('fr-FR');
  const dueDate = (() => {
    const d = new Date(invoice.startDate);
    d.setDate(d.getDate() + (c.paymentDelay ?? 30));
    return d.toLocaleDateString('fr-FR');
  })();

  const companyDisplay = c.companyName || 'Votre entreprise';
  const garageName = invoice.garage?.name    ?? invoice.garageName    ?? '';
  const garageAddr = invoice.garage?.address ?? invoice.garageAddress ?? '';
  const garageZip  = invoice.garage?.zipCode ?? invoice.garageZipCode ?? '';
  const garageCity = invoice.garage?.city    ?? invoice.garageCity    ?? '';

  const vehicleDesc = `Réparation du véhicule (${invoice.carBrand ?? ''} / ${invoice.carYear ?? ''} / ${invoice.carImmatriculation ?? ''})`;

  const tvaNote = taxRate > 0
    ? `TVA ${taxRate * 100}% — Assujetti à la TVA en Suisse.`
    : `TVA non applicable — Autoliquidation de la TVA par le client (Article 196 de la directive 2006/112/CE)`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <title>Facture ${invoice.invoiceNumber ?? ''}</title>
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

    /* SOCIÉTÉ | CLIENT */
    .parties-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 28px;
    }
    .parties-table .th-cell {
      background: #1a1a2e;
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      padding: 8px 14px;
      width: 50%;
    }
    .parties-table .td-cell {
      padding: 14px;
      vertical-align: top;
      border: 1px solid #ddd;
      border-top: none;
      font-size: 12px;
      line-height: 1.7;
      width: 50%;
    }
    .parties-table .td-cell .party-name {
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .parties-table .td-cell .party-line {
      color: #444;
    }
    .parties-table .td-cell .party-legal {
      margin-top: 8px;
      color: #666;
      font-size: 11px;
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
      <p class="doc-type">FACTURE</p>
      <div class="meta">
        <div>N° : ${invoice.invoiceNumber ?? ''}</div>
        <div>DATE : ${invoiceDate}</div>
        <div>ÉCHÉANCE : ${dueDate}</div>
      </div>
    </div>
  </div>

  <div class="content">

    <!-- SOCIÉTÉ | CLIENT -->
    <table class="parties-table">
      <tr>
        <td class="th-cell">SOCIÉTÉ</td>
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
          <div class="party-name">${garageName}</div>
          ${garageAddr ? `<div class="party-line">${garageAddr}</div>` : ''}
          ${(garageZip || garageCity) ? `<div class="party-line">${garageZip} ${garageCity}</div>` : ''}
        </td>
      </tr>
    </table>

    <!-- Lignes -->
    <table class="lines-table">
      <thead>
        <tr>
          <th>DESCRIPTION</th>
          <th class="center">QUANTITÉ</th>
          <th class="right">TOTAL</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${vehicleDesc}</td>
          <td class="center">1</td>
          <td class="right">${displayTotal.toFixed(2)} ${currencySymbol}</td>
        </tr>
      </tbody>
    </table>

    <!-- Totaux -->
    <table class="totals-table">
      <tr class="th-row">
        <td>DÉTAILS DES TOTAUX</td>
        <td class="right">MONTANT</td>
      </tr>
      <tr class="final-row">
        <td>Total</td>
        <td class="right">${displayTotal.toFixed(2)} ${currencySymbol}</td>
      </tr>
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
      <p>Le paiement devra être effectué dans un délai de ${c.paymentDelay ?? 30} jours maximum après réception de la facture.</p>
      ${c.latePaymentPenalty ? `<p>Pénalités de retard : ${c.latePaymentPenalty}.</p>` : ''}
      ${c.recoveryFee ? `<p>Indemnité de recouvrement : ${c.recoveryFee}.</p>` : ''}
    </div>
  </div>

  <div class="merci">MERCI</div>

</div>
</body>
</html>`;
};
