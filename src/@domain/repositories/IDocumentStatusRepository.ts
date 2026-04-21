import { DocumentStatusDto } from "@/@application/dtos/DocumentStatusDto";


export interface IDocumentStatusRepository {
  get(): Promise<DocumentStatusDto[]>;
  getByCode(code: string): Promise<DocumentStatusDto>;
}
