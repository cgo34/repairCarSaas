// 📁 application/useCases/quotes/SendQuoteUseCase.ts

import { CompanySettingsDto } from '@/@application/dtos/CompanySettingsDto';
import { IGenerateQuotePdfUseCase } from '@/@domain/useCases/quotes/IGenerateQuotePdfUseCase';
import { ISendQuoteUseCase } from '@/@domain/useCases/quotes/ISendQuoteUseCase';
import { IViewQuoteUseCase } from '@/@domain/useCases/quotes/IViewQuoteUseCase';
import { IEmailService } from '@/@domain/services/IEmailService';
import { IQuoteRepository } from '@/@domain/repositories/IQuoteRepository';
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

    @inject(SYMBOLS.Repositories.QuoteRepository)
    private readonly quoteRepository: IQuoteRepository,
  ) {}

  async execute(quoteId: string, company?: CompanySettingsDto | null): Promise<void> {
    const { quote, lines } = await this.viewQuoteUseCase.execute(quoteId);

    if (!quote || !lines) {
      throw new Error('Quote or quote details not found');
    }

    const pdfDataUrl = await this.generatePdfUseCase.execute(quote, lines, company ?? null);
    if (!pdfDataUrl) {
      throw new Error('Failed to generate PDF');
    }

    const recipientEmail = quote.garage?.email ?? quote.garageEmail;
    if (!recipientEmail) {
      throw new Error('Garage email not found');
    }

    const pdfBase64 = await this.urlToBase64(pdfDataUrl);
    await this.emailService.sendQuoteEmail(recipientEmail, quote.quoteNumber, pdfBase64);
    await this.quoteRepository.markAsSent(quoteId);
  }

  private async urlToBase64(url: string): Promise<string> {
    // Handle blob URLs (e.g., "blob:http://localhost:5173/xxx")
    if (url.startsWith('blob:')) {
      const response = await fetch(url);
      const blob = await response.blob();
      return await this.blobToBase64(blob);
    }
    
    // Handle data URLs (e.g., "data:application/pdf;base64,...")
    if (url.startsWith('data:')) {
      return this.extractBase64FromDataUrl(url);
    }
    
    throw new Error('Unsupported URL format for PDF');
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        // Extract base64 from the data URL
        const base64 = this.extractBase64FromDataUrl(dataUrl);
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
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
