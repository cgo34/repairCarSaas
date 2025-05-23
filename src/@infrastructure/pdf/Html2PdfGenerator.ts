import { IPdfGenerator } from '@/@domain/services/IPdfGenerator'
import { InvoiceDto } from '@/@infrastructure/dtos/InvoiceDto'
import { LineItemDto } from '@/@infrastructure/dtos/LineItemDto'
import { QuoteDto } from '@/@infrastructure/dtos/QuoteDto'
import html2pdf from 'html2pdf.js'
import { injectable } from "inversify"
import { buildInvoiceHtmlTemplate } from './templates/invoiceTemplate'
import { buildQuoteHtmlTemplate } from './templates/quoteTemplate'

@injectable()
export class Html2PdfGenerator implements IPdfGenerator {
  async generate(quote: QuoteDto, lines: LineItemDto[]): Promise<string> {
    console.log('generate', quote);
    
    const html = buildQuoteHtmlTemplate(quote, lines)

    const blob = await html2pdf()
      .set({ margin: 0, filename: `quote-${quote.quoteNumber}.pdf`, html2canvas: {}, jsPDF: {} })
      .from(html)
      .outputPdf('blob')

    return URL.createObjectURL(blob)
  }
  
  async generateInvoice(invoice: InvoiceDto, lines: LineItemDto[]): Promise<string> {
    
    const html = buildInvoiceHtmlTemplate(invoice, lines)

    const blob = await html2pdf()
      .set({ margin: 0, filename: `invoice-${invoice.quoteNumber}.pdf`, html2canvas: {}, jsPDF: {} })
      .from(html)
      .outputPdf('blob')

    return URL.createObjectURL(blob)
  }
}
