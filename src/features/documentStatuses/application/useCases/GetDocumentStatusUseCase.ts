// 📌 Application: GetDocumentStatusUseCase.ts
import { IDocumentStatusRepository } from '@/features/documentStatuses/application/ports/repositories/IDocumentStatusRepository';
import { DocumentStatusDto } from '@/features/documentStatuses/application/dtos/DocumentStatusDto';

export interface IGetDocumentStatusUseCase {
  execute(): Promise<DocumentStatusDto[]>;
  getByCode(code: string): Promise<DocumentStatusDto>;
}

export class GetDocumentStatusUseCase implements IGetDocumentStatusUseCase {
  constructor(private documentStatusRepository: IDocumentStatusRepository) {}

  async execute(): Promise<DocumentStatusDto[]> {
    return await this.documentStatusRepository.get();
  }

  async getByCode(code: string): Promise<DocumentStatusDto> {
    return await this.documentStatusRepository.getByCode(code);
  }
}
