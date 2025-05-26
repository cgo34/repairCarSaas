export const buildInvoiceHtmlTemplate = (invoice: InvoiceDto, lines: LineItemDto[]): string => {
  const totalHT = lines.reduce((sum, l) => sum + l.price, 0);
  const totalStripping = lines.reduce((sum, l) => sum + (l.dentRemovalPrice ?? 0), 0);
  const taxRate = invoice.country === 'CH' ? 0.08 : 0;
  const tva = (totalHT + totalStripping) * taxRate;
  const totalTTC = totalHT + totalStripping + tva;
  const currencySymbol = invoice.currency === 'EUR' ? '€' : invoice.currency;

  const totalsHtml = invoice.isForfait
  ? `
    <div class="totals-block">
      <table class="totals-table">
        <tfoot>
          <tr>
            <td class="label">Total TTC :</td>
            <td class="amount">${invoice.forfaitAmount.toFixed(2)} ${currencySymbol}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  `
  : `
    <div class="totals-block">
      <table class="totals-table">
        <tbody>
          <tr>
            <td class="label">Total H.T :</td>
            <td class="amount">${totalHT.toFixed(2)} ${currencySymbol}</td>
          </tr>
          <tr>
            <td class="label">Total dégarnissage :</td>
            <td class="amount">${totalStripping.toFixed(2)} ${currencySymbol}</td>
          </tr>
          <tr>
            <td class="label">Total H.T + Total Dégarnissage :</td>
            <td class="amount">${(totalHT + totalStripping).toFixed(2)} ${currencySymbol}</td>
          </tr>
          <tr>
            <td class="label">TVA (${taxRate * 100}%) :</td>
            <td class="amount">${tva.toFixed(2)} ${currencySymbol}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td class="label">Total TTC :</td>
            <td class="amount">${totalTTC.toFixed(2)} ${currencySymbol}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  `;


  let htmlTemplate = `
  <!DOCTYPE html>
  <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <title>Devis ${invoice.invoiceNumber}</title>
      <style>
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          font-family: Arial, sans-serif;
        }

        .pdf-page {
          width: 794px;
          height: 1122px;
          display: flex;
          flex-direction: column;
          background: white;
          margin: 0 auto;
        }

        .header {
          background-color: #333;
          color: white;
          padding: 20px 40px;
          display: flex;
          justify-content: space-between;
        }

        .header h1 { margin: 0; font-size: 22px; }
        .header p { margin: 4px 0; }

        .content {
          flex-grow: 1;
          padding: 40px;
        }

        .section-title {
          font-weight: bold;
          margin: 30px 0 10px;
          font-size: 16px;
        }

        .info-table {
          width: 100%;
          border-collapse: collapse;
        }

        .info-table th { text-align: left; font-size: 14px; }
        .info-table th.th-client { padding-left: 10px; }
        .info-table td { padding: 0; vertical-align: top; }

        .block {
          background: #f2f2f2;
          padding: 10px;
        }

        .block-left { margin-right: 10px; }
        .block-right { margin-left: 10px; }

        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }

        .invoice-table thead {
          background: #333;
          color: white;
        }

        .invoice-table th, .invoice-table td {
          padding: 6px;
          font-size: 13px;
        }

        .invoice-table td:nth-child(2),
        .invoice-table td:nth-child(4),
        .invoice-table td.amount {
          text-align: right;
          padding-right: 40px;
        }

        .invoice-table tbody tr:nth-child(even) {
          background: #f9f9f9;
        }

        .totals-block {
          margin-top: 30px;
          background: #f2f2f2;
          padding: 20px 0;
        }

        .totals-table {
          width: 100%;
          font-size: 13px;
          border-collapse: collapse;
        }

        .totals-table td {
          padding: 6px 0;
        }

        .totals-table td.label {
          text-align: right;
          font-weight: bold;
          padding-right: 10px;
        }

        .totals-table td.amount {
          text-align: right;
          padding-right: 40px;
        }

        .totals-table tfoot td.amount {
          font-weight: bold;
          font-size: 14px;
          color: #007BFF;
        }

        .footer {
          border-top: 1px solid #000;
          font-size: 10px;
          display: flex;
          justify-content: space-between;
          padding: 10px 40px;
          line-height: 1.2;
        }

        .tva-note {
          margin-top: 10px;
          font-style: italic;
          font-size: 11px;
        }
      </style>
    </head>
    <body>
      <div class="pdf-page">
        <div class="header">
          <div>
            <h1>IMPACT</h1>
            <p>Débosselage sans peinture</p>
          </div>
          <div style="text-align: right;">
            <p><strong>FACTURE</strong></p>
            <p>N° : ${invoice.invoiceNumber}</p>
            <p>Date : ${new Date(invoice.startDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div class="content">
          <table class="info-table">
            <thead>
              <tr>
                <th>VÉHICULE</th>
                <th class="th-client">CLIENT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td width="50%">
                  <div class="block block-left">
                    <p>Marque : ${invoice.carBrand || '-'}</p>
                    <p>Année : ${invoice.carDate || '-'}</p>
                    <p>Numéro de série : ${invoice.carId || '-'}</p>
                  </div>
                </td>
                <td width="50%">
                  <div class="block block-right">
                    <p>${invoice.garage?.name ?? invoice.garageName ?? ''}</p>
                    <p>${invoice.garage?.address ?? invoice.garageAddress ?? ''}</p>
                    <p>${invoice.garage?.zipCode ?? invoice.garageZipCode ?? ''} - ${invoice.garage?.city ?? invoice.garageCity ?? ''}</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="section-title">DÉTAIL DES INTERVENTIONS</div>
          <table class="invoice-table">
            <thead>
              <tr>
                <th>ÉLÉMENT</th>
                <th>IMPACT</th>
                <th>DESCRIPTION</th>
                <th>PRIX H.T.</th>
              </tr>
            </thead>
            <tbody>
              ${
                invoice.isForfait
                  ? `
                    <tr>
                      <td colspan="4">Réparation forfaitaire</td>
                    </tr>
                  `
              : lines.map(line => `
                <tr>
                  <td>${line.bodyPart.name || '-'}</td>
                  <td>${(line.impactCount25 ?? 0) + (line.impactCount35 ?? 0)}</td>
                  <td>${line.repairType.name || '-'}</td>
                  <td class="amount">${line.price.toFixed(2)} ${currencySymbol}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>`

          htmlTemplate += totalsHtml;

          htmlTemplate += `<p class="tva-note">
            TVA ${taxRate > 0 ? taxRate * 100 + '%' : 'non applicable'} - ${
              taxRate === 0
                ? 'Autoliquidation de la TVA par le client (Article 196 de la directive 2006/112/CE)'
                : 'Assujetti à la TVA en Suisse'
            }
          </p>
        </div>

        <div class="footer">
          <div class="footer-left">
            <p>${invoice.technician.fullName}</p>
            <p>${invoice.technician.address}</p>
            <p>${invoice.technician.zipCode} ${invoice.technician.city}</p>
            <p>Numéro fiscal : ${invoice.technician.taxNumber}</p>
          </div>
          <div class="footer-right">
            <p><strong>Terme et conditions :</strong></p>
            <p>Bon pour accord</p>
            <p>Cachet et Signature du client : ……………………………</p>
            <p style="text-align:right; font-weight:bold;">MERCI</p>
          </div>
        </div>
      </div>
    </body>
  </html>
  `;

  return htmlTemplate
};
