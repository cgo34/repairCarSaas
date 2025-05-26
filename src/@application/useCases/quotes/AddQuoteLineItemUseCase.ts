import { IQuoteDetailRepository } from '@/@domain/repositories/IQuoteDetailRepository';
import { IQuoteRepository } from '@/@domain/repositories/IQuoteRepository';
import { LineItemDto } from '@/@infrastructure/dtos/LineItemDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class AddQuoteLineItemUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.QuoteRepository) private quoteRepository: IQuoteRepository,
    @inject(SYMBOLS.Repositories.QuoteDetailRepository) private quoteDetailRepository: IQuoteDetailRepository
  ) {}

  async executeQuote(lineItem: LineItemDto): Promise<LineItemDto> {
    const updatedQuoteDto = await this.quoteDetailRepository.insert(lineItem);

    // 🔹 6. Retourner l’entité en DTO pour la présentation
    return updatedQuoteDto;
  }
}
