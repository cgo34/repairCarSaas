import { IQuoteRepository } from '@/@domain/repositories/IQuoteRepository';
import { QuoteApiModel } from '@/@infrastructure/database/api/QuoteApiModel';
import { SupabaseClient } from '@/@infrastructure/database/clients/SupabaseClient';
import { QuoteDto } from '@/@application/dtos/QuoteDto';
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
  async generateQuoteNumber(organizationId: string): Promise<string> {
    const { count, error } = await this.clientProvider.getClient()
    .from('quotes')
    .select('*', { count: 'exact', head: true }) // ⚡ Optimisé pour éviter un gros dataset
    .eq('organization_id', organizationId);
    
    if (error)
      throw new Error('Error generating quote number');

    // Format : DYYMMXXXX (D = Devis, YY = année, MM = mois, XXXX = compteur)
    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const quoteNumber = `D${year}${month}-${((count ?? 0) + 1).toString().padStart(4, '0')}`;
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
   * ============================================================
   * GET ALL BY ORGANIZATION MEMBER
   * ============================================================
   */

  async getAllByOrganizationMemberId(
    organizationId: string,
    memberId: string,
    role: 'admin' | 'manager' | 'technician',
  ): Promise<QuoteDto[]> {
    let query = this.clientProvider
      .getClient()
      .from('quotes')
      .select(`
        *,

        assigned_member:organization_members!quotes_assigned_member_id_fkey(
          *,
          users(*)
        ),

        created_by_member:organization_members!quotes_created_by_member_id_fkey(
          *,
          users(*)
        ),

        garage:garages(*),

        status:document_statuses(*),

        quote_details(*)
      `)
      .eq('organization_id', organizationId);

    if (role === 'technician') {
      query = query.or(
        `assigned_member_id.eq.${memberId},created_by_member_id.eq.${memberId}`
      );
    }

    const { data, error } =
      await query.returns<QuoteApiModel[]>();

    if (error) {
      console.error('[QuoteRepository] getAllByOrganizationMemberId error:', error);
      throw new Error('Error fetching quotes');
    }

    return data.map(QuoteMapper.apiToDto);
  }

  /**
   * ============================================================
   * GET QUOTE BY ID
   * ============================================================
   */

  async getById(
    id: string
  ): Promise<QuoteDto | null> {

    const { data, error } =
      await this.clientProvider
        .getClient()
        .from('quotes')
        .select(`
          *,

          created_by_member:organization_members!quotes_created_by_member_id_fkey(
            *,
            users(*)
          ),

          assigned_member:organization_members!quotes_assigned_member_id_fkey(
            *,
            users(*)
          ),

          garage:garages(*),

          status:document_statuses(*),

          quote_details(
            *,
            body_part:body_parts(*),
            body_material:body_materials(*),
            repair_type:repair_types(*)
          )
        `)
        .eq('id', id)
        .single<QuoteApiModel>();

    if (error) {
      console.error(
        '[QuoteRepository] getById error:',
        error
      );

      throw new Error(
        'Error fetching quote'
      );
    }

    return data
      ? QuoteMapper.apiToDto(data)
      : null;
  }

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
  async update(
    quote: QuoteDto
  ): Promise<QuoteDto> {
    const quoteApi =
      QuoteMapper.dtoToApi(quote);

    if (!quoteApi.id) {
      throw new Error(
        'Quote ID is required'
      );
    }

    const { data, error } =
      await this.clientProvider
        .getClient()
        .from('quotes')
        .update({
          ...quoteApi,
          updated_at:
            new Date().toISOString(),
        })
        .eq('id', quoteApi.id)
        .select(`
          *,

          assigned_member:organization_members!quotes_assigned_member_id_fkey(
            *,
            users(*)
          ),

          created_by_member:organization_members!quotes_created_by_member_id_fkey(
            *,
            users(*)
          ),

          garage:garages(*),

          status:document_statuses(*),

          quote_details(*)
        `)
        .single<QuoteApiModel>();

    if (error) {
      console.error(
        '[QuoteRepository] update error:',
        error
      );

      throw new Error(
        'Error updating quote'
      );
    }

    return QuoteMapper.apiToDto(
      data
    );
  }

  /**
   * Supprime un devis.
   */
  async delete(id: string): Promise<void> {
    const { error: errorDetails } = await this.clientProvider.getClient()
      .from('quote_details')
      .delete()
      .eq('quote_id', id);

    if (errorDetails) {
      console.error('Error deleting quote details:', errorDetails);
      throw new Error('Error deleting quote details');
    }

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

  async getByTechnicianId(technicianId: string): Promise<QuoteDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .from('quotes')
      .select(`
        *,
        status:document_statuses(*),
        quote_details(price, dent_removal_price)
      `)
      .eq('technician_id', technicianId)
      .returns<QuoteApiModel[]>();

    if (error) throw new Error('Error fetching quotes by technician');
    return data.map(QuoteMapper.apiToDto);
  }

  async updateCommission(quoteId: string, commissionRate: number | null, commissionPaid: boolean): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .from('quotes')
      .update({ commission_rate: commissionRate, commission_paid: commissionPaid })
      .eq('id', quoteId);

    if (error) throw new Error('Error updating commission');
  }
}
