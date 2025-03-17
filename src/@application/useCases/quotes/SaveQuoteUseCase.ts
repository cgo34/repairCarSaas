import { IQuoteRepository } from "@/@domain/repositories/IQuoteRepository";
import { SYMBOLS } from "@/@infrastructure/ioc/symbols";
import { inject, injectable } from "inversify";

@injectable()
export class SaveQuoteUseCase implements ISaveUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.QuoteRepository)
    private readonly quoteRepository: IQuoteRepository
  ) {}

  async execute(quoteId: string): Promise<void> {
    await this.quoteRepository.updateStatus(quoteId, 'saved');
  }
}
