import { DocumentStatusDto } from '@/features/documentStatuses/application/dtos/DocumentStatusDto';
import { IDocumentStatusRepository } from '@/features/documentStatuses/application/ports/repositories/IDocumentStatusRepository';
import { SupabaseClient } from '@/shared/infrastructure/supabase/SupabaseClient';
import { IClientProvider } from '@/shared/infrastructure/supabase/IClientProvider';
import { DocumentStatusMapper } from '@/features/documentStatuses/infrastructure/mappers/DocumentStatusMapper';
import { DocumentStatusApiModel } from '@/features/documentStatuses/infrastructure/api/DocumentStatusApiModel';

export class DocumentStatusRepository implements IDocumentStatusRepository {
  constructor(private clientProvider: IClientProvider<SupabaseClient>) {}

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
