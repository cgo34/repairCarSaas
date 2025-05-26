// 📁 application/useCases/invoices/SendInvoiceUseCase.ts

import { IGenerateInvoicePdfUseCase } from '@/@domain/useCases/invoices/IGenerateInvoicePdfUseCase';
import { ISendInvoiceUseCase } from '@/@domain/useCases/invoices/ISendInvoiceUseCase';
import { IViewInvoiceUseCase } from '@/@domain/useCases/invoices/IViewInvoiceUseCase';
import { IEmailService } from '@/@infrastructure/interfaces/IEmailService';
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
    
    // Generate the PDF 
    const pdfBlob = await this.generatePdfUseCase.execute(invoice, lines);
    if (!pdfBlob) {
      throw new Error('Failed to generate PDF');
    }

    const filename = `invoice-${invoice.invoiceNumber}.pdf`;
    const subject = `Votre devis ${invoice.invoiceNumber}`;

    if (!invoice.garage?.email) {
      throw new Error('Garage email not found');
    }

    await this.emailService.sendInvoicePdf(invoice.garage.email, subject, pdfBlob, filename);
  }
}
