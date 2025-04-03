import { IPdfGenerator } from '@/@domain/services/IPdfGenerator'
import { LineItemDto } from '@/@infrastructure/dtos/LineItemDto'
import { QuoteDto } from '@/@infrastructure/dtos/QuoteDto'
import html2pdf from 'html2pdf.js'
import { injectable } from "inversify"
import { buildQuoteHtmlTemplate } from './templates/quoteTemplate'

@injectable()
export class Html2PdfGenerator implements IPdfGenerator {
  async generate(quote: QuoteDto, lines: LineItemDto[]): Promise<string> {
    console.log('Html2PdfGenerator:', quote.id);
    
    const html = buildQuoteHtmlTemplate(quote, lines)

    const blob = await html2pdf()
      .set({ margin: 0, filename: `quote-${quote.quoteNumber}.pdf`, html2canvas: {}, jsPDF: {} })
      .from(html)
      .outputPdf('blob')

    return URL.createObjectURL(blob)
  }
}
