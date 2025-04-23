// 📁 application/useCases/quotes/SendQuoteUseCase.ts

import { IGenerateQuotePdfUseCase } from '@/@domain/useCases/quotes/IGenerateQuotePdfUseCase';
import { ISendQuoteUseCase } from '@/@domain/useCases/quotes/ISendQuoteUseCase';
import { IViewQuoteUseCase } from '@/@domain/useCases/quotes/IViewQuoteUseCase';
import { IEmailService } from '@/@infrastructure/interfaces/IEmailService';
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
    
    // Generate the PDF 
    const pdfBlob = await this.generatePdfUseCase.execute(quote, lines);
    if (!pdfBlob) {
      throw new Error('Failed to generate PDF');
    }

    const filename = `quote-${quote.quoteNumber}.pdf`;
    const subject = `Votre devis ${quote.quoteNumber}`;

    if (!quote.garage?.email) {
      throw new Error('Garage email not found');
    }

    await this.emailService.sendQuotePdf(quote.garage.email, subject, pdfBlob, filename);
  }
}
