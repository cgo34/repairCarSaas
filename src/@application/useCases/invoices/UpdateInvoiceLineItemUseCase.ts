import { IInvoiceDetailRepository } from '@/@domain/repositories/IInvoiceDetailRepository';
import { LineItemDto } from '@/@application/dtos/LineItemDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class UpdateInvoiceLineItemUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.InvoiceDetailRepository) private invoiceDetailRepository: IInvoiceDetailRepository
  ) {}

  async execute(lineItems: LineItemDto[]): Promise<LineItemDto[]> {
    
    const updatedInvoiceDto = await this.invoiceDetailRepository.update(lineItems);

    return updatedInvoiceDto;
  }
}
