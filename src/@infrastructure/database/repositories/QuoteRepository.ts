import { IQuoteRepository } from '@/@domain/repositories/IQuoteRepository';
import { QuoteApiModel } from '@/@infrastructure/database/api/QuoteApiModel';
import { SupabaseClient } from '@/@infrastructure/database/clients/SupabaseClient';
import { QuoteDto } from '@/@infrastructure/dtos/QuoteDto';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { QuoteMapper } from '@/@infrastructure/mappers/QuoteMapper';
import { inject, injectable } from 'inversify';

@injectable()
export class QuoteRepository implements IQuoteRepository {
  constructor(@inject(SYMBOLS.Providers.ClientProvider) private clientProvider: IClientProvider<SupabaseClient>) {}

  /**
   * Génère un numéro de devis unique.
   */
  async generateQuoteNumber(userId): Promise<string> {
    const { count, error } = await this.clientProvider.getClient()
    .from('quotes')
    .select('*', { count: 'exact', head: true }) // ⚡ Optimisé pour éviter un gros dataset
    .eq('user_id', userId);
    
    if (error)
      throw new Error('Error generating quote number');

    const year = new Date().getFullYear().toString().slice(-2);
    const month = new Date().getMonth().toString().slice(-2);
    const quoteNumber = `D${year}${month}${(count! + 1).toString().padStart(4, '0')}`;
    
    return quoteNumber;
  }

  /**
   * Récupère tous les devis.
   */
  async getAll(): Promise<QuoteDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .from('quotes')
      .select('*')
      .returns<QuoteApiModel[]>();

    if (error)
      throw new Error('Error fetching quotes');

    return data.map(QuoteMapper.apiToDto);
  }

  /**
   * Récupère tous les devis d'un utilisateur.
   */
  async getAllByUserId(userId: string): Promise<QuoteDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .from('quotes')
      .select(`
        *,
        user:users!quotes_user_id_fkey(*),
        technician:users!quotes_technician_id_fkey(*),
        garage:garages(*),
        status:document_statuses(*),
        quote_details(price, dent_removal_price)
      `)
      .eq('user_id', userId)
      .returns<QuoteApiModel[]>();

    if (error)
      throw new Error('Error fetching user quotes');
    
    return data.map(QuoteMapper.apiToDto);
  }

  /**
   * Récupère un devis par ID.
   */
  async getById(id: string): Promise<QuoteDto | null> {
    const { data, error } = await this.clientProvider.getClient()
      .from('quotes')
      .select(`
        *,
        user:users!quotes_user_id_fkey(*),
        technician:users!quotes_technician_id_fkey(*),
        garage:garages(*),
        status:document_statuses(*)
      `)
      .eq('id', id)
      .single<QuoteApiModel>();

    if (error)
      throw new Error('Error fetching quote');    

    return data ? QuoteMapper.apiToDto(data) : null;
  }

  // TODO: (gce) -> TO BE MOVE TO DetailRepository
  // async getDetails(quoteId: string): Promise<LineItemDto[]> {
  //   const { data, error } = await this.clientProvider.getClient()
  //     .from('quote_details')
  //     .select('*')
  //     .eq('quote_id', quoteId)
  //     .returns<QuoteDetailApiModel[]>();
  
  //   if (error) throw new Error(`Error fetching quote details: ${error.message}`);
  
  //   return data.map(LineItemMapper.apiToDto);
  // }
  

  /**
   * Crée un devis.
   */
  async create(quote: QuoteDto): Promise<QuoteDto> {
    const quoteApi = QuoteMapper.dtoToApi(quote);

    const { data, error } = await this.clientProvider.getClient()
      .from('quotes')
      .insert(quoteApi)
      .select('*')
      .single<QuoteApiModel>();

    if (error)
      throw new Error('Error creating quote');

    return QuoteMapper.apiToDto(data);
  }

  /**
   * Met à jour un devis.
   */
  async update(quote: QuoteDto): Promise<QuoteDto> {
    const quoteApi = QuoteMapper.dtoToApi(quote);

    if (!quoteApi.id) throw new Error('Quote ID is required');

    const { data, error } = await this.clientProvider.getClient()
      .from('quotes')
      .update({...quoteApi, updated_at: new Date().toISOString()})
      .eq('id', quoteApi.id)
      .select(`
        *,
        user:users!quotes_user_id_fkey(*),
        technician:users!quotes_technician_id_fkey(*),
        garage:garages(*)
      `);

    if (error)
      throw new Error('Error updating quote');

    return QuoteMapper.apiToDto(data);
  }

  /**
   * Supprime un devis.
   */
  async delete(id: string): Promise<void> {
    const { errorDetails } = await this.clientProvider.getClient()
      .from('quote_details')
      .delete()
      .eq('quote_id', id);

    const { error } = await this.clientProvider.getClient()
      .from('quotes')
      .delete()
      .eq('id', id);

    if (error)
      throw new Error('Error deleting quote');    
  }

  async updateStatus(quoteId: string, statusId: string): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .from('quotes')
      .update({ status_id: statusId })
      .eq('id', quoteId);

    if (error) throw new Error('Error updating quote status');
  }
}
