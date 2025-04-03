import { LineItemDto } from '@/@infrastructure/dtos/LineItemDto'
import { QuoteDto } from '@/@infrastructure/dtos/QuoteDto'

export const buildQuoteHtmlTemplate = (quote: QuoteDto, lines: LineItemDto[]): string => {
  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <title>Devis ${quote.quoteNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 2rem; }
          h1 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 2rem; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background-color: #f4f4f4; }
          .totals { text-align: right; margin-top: 2rem; }
        </style>
      </head>
      <body>
        <h1>Devis #${quote.quoteNumber}</h1>
        <p><strong>Date:</strong> ${new Date(quote.startDate).toLocaleDateString()}</p>

        <table>
          <thead>
            <tr>
              <th>Élément</th>
              <th>Type réparation</th>
              <th>Ø25</th>
              <th>Ø35</th>
              <th>Prix (€)</th>
            </tr>
          </thead>
          <tbody>
            ${lines.map(line => `
              <tr>
                <td>${line.bodyPartId}</td>
                <td>${line.repairTypeId}</td>
                <td>${line.impactCount25 ?? 0}</td>
                <td>${line.impactCount35 ?? 0}</td>
                <td>${line.price.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <p><strong>Total HT:</strong> ${lines.reduce((sum, l) => sum + l.price, 0).toFixed(2)} €</p>
        </div>
      </body>
    </html>
  `
}
