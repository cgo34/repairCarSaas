import { CompanySettingsDto } from '@/@application/dtos/CompanySettingsDto'
import { InvoiceDto } from '@/@application/dtos/InvoiceDto'
import { LineItemDto } from '@/@application/dtos/LineItemDto'
import { QuoteDto } from '@/@application/dtos/QuoteDto'
import { IPdfGenerator } from '@/@domain/services/IPdfGenerator'
import html2pdf from 'html2pdf.js'
import { injectable } from "inversify"
import { buildInvoiceHtmlTemplate } from './templates/invoiceTemplate'
import { buildQuoteHtmlTemplate } from './templates/quoteTemplate'

@injectable()
export class Html2PdfGenerator implements IPdfGenerator {
  async generate(quote: QuoteDto, lines: LineItemDto[], company: CompanySettingsDto | null): Promise<string> {
    const html = buildQuoteHtmlTemplate(quote, lines, company)

    const blob = await html2pdf()
      .set({ margin: 0, filename: `quote-${quote.quoteNumber}.pdf`, html2canvas: {}, jsPDF: {} })
      .from(html)
      .outputPdf('blob')

    return URL.createObjectURL(blob)
  }

  async generateInvoice(invoice: InvoiceDto, lines: LineItemDto[], company: CompanySettingsDto | null): Promise<string> {
    const html = buildInvoiceHtmlTemplate(invoice, lines, company)

    const blob = await html2pdf()
      .set({ margin: 0, filename: `invoice-${invoice.invoiceNumber}.pdf`, html2canvas: {}, jsPDF: {} })
      .from(html)
      .outputPdf('blob')

    return URL.createObjectURL(blob)
  }
}
