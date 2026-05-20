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
    const pdfBase64 = await this.urlToBase64(pdfDataUrl);
    await this.emailService.sendQuoteEmail(quote.garage.email, quote.quoteNumber, pdfBase64);
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
    console.log('Data URL:', dataUrl, base64Index);
    if (base64Index === -1) {
      throw new Error('Invalid data URL format');
    }
    return dataUrl.substring(base64Index + base64Marker.length);
  }
}
