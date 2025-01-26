import { InvoiceService } from '@/@application/services/InvoiceService';
import { Invoice } from '@/@domain/entities/Invoice';

export class CreateInvoiceUseCase {
  private invoiceService: InvoiceService;

  constructor(invoiceService: InvoiceService) {
    this.invoiceService = invoiceService;
  }

  async execute(invoice: Invoice) {
    return await this.invoiceService.createInvoice(invoice);
  }
}
