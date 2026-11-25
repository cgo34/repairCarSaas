import { IQuoteRepository } from '@/features/quotes/application/ports/repositories/IQuoteRepository';

export interface ICountQuotesThisMonthUseCase {
  execute(organizationId: string): Promise<number>;
}

export class CountQuotesThisMonthUseCase implements ICountQuotesThisMonthUseCase {
  constructor(private readonly quoteRepository: IQuoteRepository) {}

  async execute(organizationId: string): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return this.quoteRepository.countCreatedSince(organizationId, startOfMonth.toISOString());
  }
}
