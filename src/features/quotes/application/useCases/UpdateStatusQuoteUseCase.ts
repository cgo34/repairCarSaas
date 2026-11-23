
import { DocumentStatusDto } from "@/features/documentStatuses/application/dtos/DocumentStatusDto";
import { IGetDocumentStatusUseCase } from "@/features/documentStatuses/application/useCases/GetDocumentStatusUseCase";
import { IQuoteRepository } from "@/features/quotes/application/ports/repositories/IQuoteRepository";

export interface IUpdateStatusQuoteUseCase {
  execute(quoteId: string, statusCode: string): Promise<DocumentStatusDto>;
}

export class UpdateStatusQuoteUseCase implements IUpdateStatusQuoteUseCase {
  constructor(
      private readonly quoteRepository: IQuoteRepository,
      private readonly getDocumentStatusUseCase: IGetDocumentStatusUseCase
  ) {}

  async execute(quoteId: string, statusCode: string): Promise<DocumentStatusDto> {
    const status = await this.getDocumentStatusUseCase.getByCode(statusCode);
    if (!status?.id) throw new Error(`Statut introuvable : ${statusCode}`);
    await this.quoteRepository.updateStatus(quoteId, status.id);
    return status;
  }
}
