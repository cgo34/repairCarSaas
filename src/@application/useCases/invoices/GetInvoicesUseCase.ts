import { InvoiceService } from '@/@application/services/InvoiceService';

export class GetInvoicesUseCase {
  private invoiceService: InvoiceService;

  constructor(invoiceService: InvoiceService) {
    this.invoiceService = invoiceService;
  }

  async execute() {
    return await this.invoiceService.getAllInvoices();
  }
}
