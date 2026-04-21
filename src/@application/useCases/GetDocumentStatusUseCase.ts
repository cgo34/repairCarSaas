// 📌 Application: GetDocumentStatusUseCase.ts
import { IDocumentStatusRepository } from '@/@domain/repositories/IDocumentStatusRepository';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';
import { DocumentStatusDto } from '../dtos/DocumentStatusDto';
import { IGetDocumentStatusUseCase } from '@/@domain/useCases/IGetDocumentStatusUseCase';

@injectable()
export class GetDocumentStatusUseCase implements IGetDocumentStatusUseCase {
  constructor(@inject(SYMBOLS.Repositories.DocumentStatusRepository) private documentStatusRepository: IDocumentStatusRepository) {}

  async execute(): Promise<DocumentStatusDto[]> {
    return await this.documentStatusRepository.get();
  }

  async getByCode(code: string): Promise<DocumentStatusDto> {
    return await this.documentStatusRepository.getByCode(code);
  }
}
