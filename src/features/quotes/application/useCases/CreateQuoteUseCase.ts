import { IQuoteRepository } from '@/features/quotes/application/ports/repositories/IQuoteRepository';

export interface ICreateQuoteUseCase {
  execute(userId: string): Promise<string>; // Retourne uniquement le quoteNumber
}

export class CreateQuoteUseCase implements ICreateQuoteUseCase {
  constructor(
    private quoteRepository: IQuoteRepository
  ) {}

  async execute(userId: string): Promise<string> {
    return this.quoteRepository.generateQuoteNumber(userId);
  }
}
