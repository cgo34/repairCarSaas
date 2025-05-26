// 📌 Application: GetDocumentStatuseUseCase.ts
// TODO: (GCE) -> NOT USE FOR THE MOMENT
import { IDocumentStatuseRepository } from '@/@domain/repositories/IDocumentStatuseRepository';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';
import { DocumentStatuseDto } from '../dtos/DocumentStatuseDto';

@injectable()
export class GetDocumentStatuseUseCase {
  constructor(@inject(SYMBOLS.Repositories.DocumentStatuseRepository) private documentStatuseRepository: IDocumentStatuseRepository) {}

  async execute(): Promise<DocumentStatuseDto[]> {
    return await this.documentStatuseRepository.get();
  }
}
