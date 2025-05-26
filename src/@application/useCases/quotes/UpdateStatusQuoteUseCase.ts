// TODO: (GCE) -> NOT USE FOR THE MOMENT
import { DocumentStatuseDto } from "@/@application/dtos/DocumentStatuseDto";
import { IQuoteRepository } from "@/@domain/repositories/IQuoteRepository";
import { IUpdateStatusQuoteUseCase } from "@/@domain/useCases/quotes/IUpdateStatusQuoteUseCase";
import { SYMBOLS } from "@/@infrastructure/ioc/symbols";
import { inject, injectable } from "inversify";

@injectable()
export class UpdateStatusQuoteUseCase implements IUpdateStatusQuoteUseCase {
  constructor(
      @inject(SYMBOLS.Repositories.QuoteRepository)
      private readonly quoteRepository: IQuoteRepository
  ) {}

  async execute(quoteId: string, status: DocumentStatuseDto): Promise<void> {
    await this.quoteRepository.updateStatus(quoteId, status?.id);
  }
}
