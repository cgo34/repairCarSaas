// 📁 application/useCases/quotes/SendQuoteUseCase.ts

import { IGenerateQuotePdfUseCase } from '@/@domain/useCases/quotes/IGenerateQuotePdfUseCase';
import { ISendQuoteUseCase } from '@/@domain/useCases/quotes/ISendQuoteUseCase';
import { IViewQuoteUseCase } from '@/@domain/useCases/quotes/IViewQuoteUseCase';
import { IEmailService } from '@/@domain/services/IEmailService';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class SendQuoteUseCase implements ISendQuoteUseCase {
  constructor(
    @inject(SYMBOLS.UseCases.Quote.ViewQuoteUseCase)
    private readonly viewQuoteUseCase: IViewQuoteUseCase,

    @inject(SYMBOLS.UseCases.Quote.GenerateQuotePdfUseCase)
    private readonly generatePdfUseCase: IGenerateQuotePdfUseCase,

    @inject(SYMBOLS.Services.EmailService)
    private readonly emailService: IEmailService,
  ) {}

  async execute(quoteId: string): Promise<void> {
    const { quote, lines } = await this.viewQuoteUseCase.execute(quoteId);

    if (!quote || !lines) {
      throw new Error('Quote or quote details not found');
    }
    
    // Generate the PDF (returns a data URL string)
    const pdfDataUrl = await this.generatePdfUseCase.execute(quote, lines);
    if (!pdfDataUrl) {
      throw new Error('Failed to generate PDF');
    }

    if (!quote.garage?.email) {
      throw new Error('Garage email not found');
    }

    // Extract base64 from data URL (format: "data:application/pdf;base64,...")
    const pdfBase64 = this.extractBase64FromDataUrl(pdfDataUrl);

    await this.emailService.sendQuoteEmail(quote.garage.email, quote.quoteNumber, pdfBase64);
  }

  private extractBase64FromDataUrl(dataUrl: string): string {
    const base64Marker = ';base64,';
    const base64Index = dataUrl.indexOf(base64Marker);
    if (base64Index === -1) {
      throw new Error('Invalid data URL format');
    }
    return dataUrl.substring(base64Index + base64Marker.length);
  }
}
