import { DocumentStatuseDto } from '@/@application/dtos/DocumentStatuseDto';
import { IDocumentStatuseRepository } from '@/@domain/repositories/IDocumentStatuseRepository';
import { SupabaseClient } from '@/@infrastructure/database/clients/SupabaseClient';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { DocumentStatuseMapper } from '@/@infrastructure/mappers/DocumentMapper';
import { inject, injectable } from 'inversify';
import { DocumentStatuseApiModel } from '../api/DocumentStatuseApiModel';

@injectable()
export class DocumentStatuseRepository implements IDocumentStatuseRepository {
  constructor(@inject(SYMBOLS.Providers.ClientProvider) private clientProvider: IClientProvider<SupabaseClient>) {}

  /**
   * Récupère tous les status.
   */
  async get(): Promise<DocumentStatuseDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .from('document_statuses')
      .select('*')
      .returns<DocumentStatuseApiModel[]>();

    if (error)
      throw new Error('Error fetching document statuses');

    return data.map(DocumentStatuseMapper.apiToDto);
  }
}
