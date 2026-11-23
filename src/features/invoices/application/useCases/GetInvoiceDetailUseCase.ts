// 📌 Application: GetInvoiceUseCase.ts
import { IInvoiceDetailRepository } from '@/features/invoices/application/ports/repositories/IInvoiceDetailRepository';
import { LineItemDto } from '@/features/lineItems/application/dtos/LineItemDto';

export interface IGetInvoiceDetailUseCase {
  execute(invoiceId: string): Promise<LineItemDto[] | null>;
}

export class GetInvoiceDetailUseCase {
  constructor(private invoiceDetailRepository: IInvoiceDetailRepository) {}

  async execute(id: string): Promise<LineItemDto[] | null> {
    const result =  await this.invoiceDetailRepository.get(id)
    
    return result;
  }
}
