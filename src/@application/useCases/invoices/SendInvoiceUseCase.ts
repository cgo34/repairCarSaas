// 📁 application/useCases/invoices/SendInvoiceUseCase.ts

import { IGenerateInvoicePdfUseCase } from '@/@domain/useCases/invoices/IGenerateInvoicePdfUseCase';
import { ISendInvoiceUseCase } from '@/@domain/useCases/invoices/ISendInvoiceUseCase';
import { IViewInvoiceUseCase } from '@/@domain/useCases/invoices/IViewInvoiceUseCase';
import { IEmailService } from '@/@domain/services/IEmailService';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class SendInvoiceUseCase implements ISendInvoiceUseCase {
  constructor(
    @inject(SYMBOLS.UseCases.Invoice.ViewInvoiceUseCase)
    private readonly viewInvoiceUseCase: IViewInvoiceUseCase,

    @inject(SYMBOLS.UseCases.Invoice.GenerateInvoicePdfUseCase)
    private readonly generatePdfUseCase: IGenerateInvoicePdfUseCase,

    @inject(SYMBOLS.Services.EmailService)
    private readonly emailService: IEmailService,
  ) {}

  async execute(invoiceId: string): Promise<void> {
    const { invoice, lines } = await this.viewInvoiceUseCase.execute(invoiceId);

    if (!invoice || !lines) {
      throw new Error('Invoice or invoice details not found');
    }
    
    // Generate the PDF (returns a blob URL or data URL)
    const pdfUrl = await this.generatePdfUseCase.execute(invoice, lines);
    if (!pdfUrl) {
      throw new Error('Failed to generate PDF');
    }

    // Get recipient email (from garage object or fallback to garageEmail field)
    const recipientEmail = invoice.garage?.email || invoice.garageEmail;
    if (!recipientEmail) {
      throw new Error('Aucune adresse email de destination trouvée');
    }

    if (!invoice.invoiceNumber) {
      throw new Error('Invoice number not found');
    }

    // Convert URL to base64 (handles both blob URLs and data URLs)
    const pdfBase64 = await this.urlToBase64(pdfUrl);

    await this.emailService.sendInvoiceEmail(recipientEmail, invoice.invoiceNumber, pdfBase64);
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
