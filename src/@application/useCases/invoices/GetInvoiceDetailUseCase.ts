// 📌 Application: GetInvoiceUseCase.ts
import { IInvoiceDetailRepository } from '@/@domain/repositories/IInvoiceDetailRepository';
import { LineItemDto } from '@/@infrastructure/dtos/LineItemDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class GetInvoiceDetailUseCase {
  constructor(@inject(SYMBOLS.Repositories.InvoiceDetailRepository) private invoiceDetailRepository: IInvoiceDetailRepository) {}

  async execute(id: string): Promise<LineItemDto[] | null> {
    const result =  await this.invoiceDetailRepository.get(id)
    
    return result;
  }
}
