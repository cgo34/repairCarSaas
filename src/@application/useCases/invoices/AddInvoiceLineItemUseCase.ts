import { IInvoiceDetailRepository } from '@/@domain/repositories/IInvoiceDetailRepository';
import { IInvoiceRepository } from '@/@domain/repositories/IInvoiceRepository';
import { LineItemDto } from '@/@application/dtos/LineItemDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class AddInvoiceLineItemUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.InvoiceRepository) private invoiceRepository: IInvoiceRepository,
    @inject(SYMBOLS.Repositories.InvoiceDetailRepository) private invoiceDetailRepository: IInvoiceDetailRepository
  ) {}

  async executeInvoice(lineItem: LineItemDto): Promise<LineItemDto> {
    const updatedInvoiceDto = await this.invoiceDetailRepository.insert(lineItem);

    // 🔹 6. Retourner l’entité en DTO pour la présentation
    return updatedInvoiceDto;
  }
}
