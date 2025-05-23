import { DocumentStatuseDto } from "@/@application/dtos/DocumentStatuseDto";

export interface IUpdateStatusQuoteUseCase {
  execute(quoteId: string, status: DocumentStatuseDto): Promise<void>;
}
