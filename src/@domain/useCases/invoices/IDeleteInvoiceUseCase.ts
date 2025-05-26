export interface IDeleteInvoiceUseCase {
  execute(invoiceId: string): Promise<void>;
}