import { IQuoteDetailRepository } from '@/@domain/repositories/IQuoteDetailRepository';
import { IQuoteRepository } from '@/@domain/repositories/IQuoteRepository';
import { LineItemViewModel } from '@/@presentation/types/models/LineItemViewModel';
import { LineItemViewMapper } from '@/@presentation/mappers/LineItemViewMapper';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class AddQuoteLineItemUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.QuoteRepository) private quoteRepository: IQuoteRepository,
    @inject(SYMBOLS.Repositories.QuoteDetailRepository) private quoteDetailRepository: IQuoteDetailRepository
  ) {}

  async executeQuote(lineItem: LineItemViewModel): Promise<LineItemViewModel> {
    const dto = LineItemViewMapper.viewToDto(lineItem);
    const updatedQuoteDto = await this.quoteDetailRepository.insert(dto);
    return LineItemViewMapper.dtoToView(updatedQuoteDto);
  }
}
