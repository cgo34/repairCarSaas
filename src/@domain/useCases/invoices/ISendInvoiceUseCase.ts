export interface ISendInvoiceUseCase {
  execute(invoiceId: string): Promise<void>;
}
