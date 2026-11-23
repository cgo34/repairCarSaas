import { OrganizationProfileDto } from '@/features/organizations/application/dtos/OrganizationProfileDto'
import { InvoiceDto } from '@/features/invoices/application/dtos/InvoiceDto'
import { LineItemDto } from '@/features/lineItems/application/dtos/LineItemDto'
import { QuoteDto } from '@/features/quotes/application/dtos/QuoteDto'
import { IPdfGenerator } from '@/shared/application/ports/IPdfGenerator'
import html2pdf from 'html2pdf.js'
import { buildInvoiceHtmlTemplate } from '@/features/invoices/infrastructure/pdf/invoiceTemplate'
import { buildQuoteHtmlTemplate } from '@/features/quotes/infrastructure/pdf/quoteTemplate'

export class Html2PdfGenerator implements IPdfGenerator {
  async generate(quote: QuoteDto, lines: LineItemDto[], company: OrganizationProfileDto | null): Promise<string> {
    const html = buildQuoteHtmlTemplate(quote, lines, company)

    const blob = await html2pdf()
      .set({
        margin: 0,
        filename: `quote-${quote.quoteNumber}.pdf`,
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(html)
      .outputPdf('blob')

    return URL.createObjectURL(blob)
  }

  async generateInvoice(invoice: InvoiceDto, lines: LineItemDto[], company: OrganizationProfileDto | null): Promise<string> {
    const html = buildInvoiceHtmlTemplate(invoice, lines, company)

    const blob = await html2pdf()
      .set({
        margin: 0,
        filename: `invoice-${invoice.invoiceNumber}.pdf`,
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(html)
      .outputPdf('blob')

    return URL.createObjectURL(blob)
  }
}
