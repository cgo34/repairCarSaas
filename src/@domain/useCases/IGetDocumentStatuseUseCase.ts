import { DocumentStatuseDto } from "@/@application/dtos/DocumentStatuseDto";

export interface IGetDocumentStatuseUseCase {
  execute(): Promise<DocumentStatuseDto[]>;
}
