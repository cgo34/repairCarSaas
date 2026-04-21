// 📌 Application: GetDocumentStatusUseCase.ts
// TODO: (GCE) -> NOT USE FOR THE MOMENT
import { IDocumentStatusRepository } from '@/@domain/repositories/IDocumentStatusRepository';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';
import { DocumentStatusDto } from '../dtos/DocumentStatusDto';

@injectable()
export class GetDocumentStatusUseCase {
  constructor(@inject(SYMBOLS.Repositories.DocumentStatusRepository) private documentStatusRepository: IDocumentStatusRepository) {}

  async execute(): Promise<DocumentStatusDto[]> {
    return await this.documentStatusRepository.get();
  }
}
