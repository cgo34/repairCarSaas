import { IQuoteRepository } from '@/@domain/repositories/IQuoteRepository';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';
import { ICreateQuoteUseCase } from '@/@domain/useCases/quotes/ICreateQuoteUseCase';

@injectable()
export class CreateQuoteUseCase implements ICreateQuoteUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.QuoteRepository) private quoteRepository: IQuoteRepository
  ) {}

  async execute(userId: string): Promise<string> {
    return this.quoteRepository.generateQuoteNumber(userId);
  }
}
