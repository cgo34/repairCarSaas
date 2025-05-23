import { DocumentStatuseDto } from "@/@application/dtos/DocumentStatuseDto";


export interface IDocumentStatuseRepository {
  get(): Promise<DocumentStatuseDto[]>;
}
