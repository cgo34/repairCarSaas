import { DocumentStatusDto } from '@/@application/dtos/DocumentStatusDto';
import { IDocumentStatusRepository } from '@/@domain/repositories/IDocumentStatusRepository';
import { SupabaseClient } from '@/@infrastructure/database/clients/SupabaseClient';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { DocumentStatusMapper } from '@/@infrastructure/mappers/DocumentStatusMapper';
import { inject, injectable } from 'inversify';
import { DocumentStatusApiModel } from '../api/DocumentStatusApiModel';

@injectable()
export class DocumentStatusRepository implements IDocumentStatusRepository {
  constructor(@inject(SYMBOLS.Providers.ClientProvider) private clientProvider: IClientProvider<SupabaseClient>) {}

  /**
   * Récupère tous les status.
   */
  async get(): Promise<DocumentStatusDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .from('document_statuses')
      .select('*')
      .returns<DocumentStatusApiModel[]>();

    if (error)
      throw new Error('Error fetching document statuses');

    return data.map(DocumentStatusMapper.apiToDto);
  }

  /**
   * Récupère un status par son code.
   * @param code Le code du status à récupérer.
   */
  async getByCode(code: string): Promise<DocumentStatusDto> {
    const { data, error } = await this.clientProvider.getClient()
      .from('document_statuses')
      .select('*')
      .eq('code', code)
      .single<DocumentStatusApiModel>();

    if (error)
      throw new Error(`Error fetching document status with code: ${code}`);

    return DocumentStatusMapper.apiToDto(data);
  }
}
