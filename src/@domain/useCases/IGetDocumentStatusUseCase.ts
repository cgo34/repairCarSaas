import { DocumentStatusDto } from "@/@application/dtos/DocumentStatusDto";

export interface IGetDocumentStatusUseCase {
  execute(): Promise<DocumentStatusDto[]>;
  getByCode(code: string): Promise<DocumentStatusDto>;
}
