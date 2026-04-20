// 📌 Application: GetQuoteUseCase.ts
// TODO: (GCE) -> NOT USE FOR THE MOMENT
import { IQuoteRepository } from '@/@domain/repositories/IQuoteRepository';
import { QuoteViewModel } from '@/@presentation/types/models/QuoteViewModel';
import { QuoteMapper } from '@/@presentation/mappers/QuoteMapper';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class GetQuoteUseCase {
  constructor(@inject(SYMBOLS.Repositories.QuoteRepository) private quoteRepository: IQuoteRepository) {}

  async execute(id: string): Promise<QuoteViewModel | null> {
    const dto = await this.quoteRepository.getById(id);
    return dto ? QuoteMapper.dtoToView(dto) : null;
  }
}
