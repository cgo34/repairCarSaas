import { IInvoiceRepository } from '@/features/invoices/application/ports/repositories/IInvoiceRepository';
import { InvoiceApiModel } from '@/features/invoices/infrastructure/api/InvoiceApiModel';
import { SupabaseClient } from '@/shared/infrastructure/supabase/SupabaseClient';
import { InvoiceDto } from '@/features/invoices/application/dtos/InvoiceDto';
import { IClientProvider } from '@/shared/infrastructure/supabase/IClientProvider';
import { InvoiceMapper } from '@/features/invoices/infrastructure/mappers/InvoiceMapper';

export class InvoiceRepository implements IInvoiceRepository {
  constructor(private clientProvider: IClientProvider<SupabaseClient>) {}

  /**
   * Génère un numéro de devis unique.
   */
  async generateInvoiceNumber(organizationId: string): Promise<string> {
    const { count, error } = await this.clientProvider.getClient()
    .from('invoices')
    .select('*', { count: 'exact', head: true }) // ⚡ Optimisé pour éviter un gros dataset
    .eq('organization_id', organizationId);
    
    if (error)
      throw new Error('Error generating invoice number');

    const year = new Date()
      .getFullYear()
      .toString()
      .slice(-2);

    const month = (
      new Date().getMonth() + 1
    )
      .toString()
      .padStart(2, '0');

    const invoiceNumber = `F${year}${month}-${(
      (count ?? 0) + 1
    )
      .toString()
      .padStart(4, '0')}`;
    
    return invoiceNumber;
  }

  async countCreatedSince(organizationId: string, sinceIso: string): Promise<number> {
    const { count, error } = await this.clientProvider.getClient()
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .gte('created_at', sinceIso);

    if (error)
      throw new Error('Error counting invoices');

    return count ?? 0;
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
  ): Promise<InvoiceDto[]> {

    let query = this.clientProvider
      .getClient()
      .from('invoices')
      .select(`
        *,

        assigned_member:organization_members!invoices_assigned_member_id_fkey(
          *,
          users(*)
        ),

        created_by_member:organization_members!invoices_created_by_member_id_fkey(
          *,
          users(*)
        ),

        garage:garages(*),

        status:document_statuses(*),

        invoice_details(*),

        quote:quotes(*)
      `)
      .eq(
        'organization_id',
        organizationId
      );

    /**
     * ============================================================
     * TECHNICIAN
     * ============================================================
     */

    if (role === 'technician') {

      query = query.or(
        `
        assigned_member_id.eq.${memberId},
        created_by_member_id.eq.${memberId}
        `
      );
    }

    const { data, error } =
      await query.returns<
        InvoiceApiModel[]
      >();

    if (error) {

      console.error(
        '[InvoiceRepository] getAllByOrganizationMemberId error:',
        error
      );

      throw new Error(
        'Error fetching invoices'
      );
    }

    return data.map(
      InvoiceMapper.apiToDto
    );
  }

  /**
   * Récupère tous les devis d'un utilisateur.
   */
  async getAllByUserId(userId: string): Promise<InvoiceDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .from('invoices')
      .select(`
        *,
        technician:users!invoices_technician_id_fkey(*),
        garage:garages(*),
        status:document_statuses(*),
        invoice_details(price, dent_removal_price)
      `)
      .eq('user_id', userId)
      .returns<InvoiceApiModel[]>();

    if (error)
      throw new Error('Error fetching user invoices');

    return data.map(InvoiceMapper.apiToDto);
  }

  /**
   * ============================================================
   * GET INVOICE BY ID
   * ============================================================
   */

  async getById(
    id: string
  ): Promise<InvoiceDto | null> {

    const { data, error } =
      await this.clientProvider
        .getClient()
        .from('invoices')
        .select(`
          *,

          created_by_member:organization_members!invoices_created_by_member_id_fkey(
            *,
            users(*)
          ),

          assigned_member:organization_members!invoices_assigned_member_id_fkey(
            *,
            users(*)
          ),

          garage:garages(*),

          status:document_statuses(*),

          quote:quotes(*),

          invoice_details(
            *,
            body_part:body_parts(*),
            body_material:body_materials(*),
            repair_type:repair_types(*)
          )
        `)
        .eq('id', id)
        .single<InvoiceApiModel>();

    if (error) {

      console.error(
        '[InvoiceRepository] getById error:',
        error
      );

      throw new Error(
        'Error fetching invoice'
      );
    }

    return data
      ? InvoiceMapper.apiToDto(data)
      : null;
  }

  // TODO: (gce) -> TO BE MOVE TO DetailRepository
  // async getDetails(invoiceId: string): Promise<LineItemDto[]> {
  //   const { data, error } = await this.clientProvider.getClient()
  //     .from('invoice_details')
  //     .select('*')
  //     .eq('invoice_id', invoiceId)
  //     .returns<InvoiceDetailApiModel[]>();
  
  //   if (error) throw new Error(`Error fetching invoice details: ${error.message}`);
  
  //   return data.map(LineItemMapper.apiToDto);
  // }
  

  /**
   * Crée un devis.
   */
  async create(invoice: InvoiceDto): Promise<InvoiceDto> {
    const invoiceApi = InvoiceMapper.dtoToApi(invoice);

    const { data, error } = await this.clientProvider.getClient()
      .from('invoices')
      .insert(invoiceApi)
      .select('*')
      .single<InvoiceApiModel>();

    if (error)
      throw new Error('Error creating invoice');

    return InvoiceMapper.apiToDto(data);
  }

  /**
   * Met à jour un devis.
   */
  async update(invoice: InvoiceDto): Promise<InvoiceDto> {
    const invoiceApi = InvoiceMapper.dtoToApi(invoice);

    if (!invoiceApi.id) throw new Error('Invoice ID is required');

    const { data, error } = await this.clientProvider.getClient()
      .from('invoices')
      .update({...invoiceApi, updated_at: new Date().toISOString()})
      .eq('id', invoiceApi.id)
      .select(`
        *,
        garage:garages(*)
      `)
      .returns<InvoiceApiModel[]>();

    if (error) {
      console.error('[InvoiceRepository.update] Supabase error:', error.message, error.details, error.hint);
      throw new Error('Error updating invoice');
    }

    return InvoiceMapper.apiToDto(data[0]);
  }

  /**
   * Supprime un devis.
   */
  async delete(id: string): Promise<void> {
    const { error: errorDetails } = await this.clientProvider.getClient()
      .from('invoice_details')
      .delete()
      .eq('invoice_id', id);

    if (errorDetails)
      throw new Error('Error deleting invoice details');

    const { error } = await this.clientProvider.getClient()
      .from('invoices')
      .delete()
      .eq('id', id);

    if (error)
      throw new Error('Error deleting invoice');    
  }

  // async addLineItem(invoiceId: string, lineItem: InvoiceLineItem): Promise<void> {
  //   const lineApi: InvoiceDetailApiModel = {
  //     id: crypto.randomUUID(),
  //     invoice_id: invoiceId,
  //     body_part_id: lineItem.bodyPartId,
  //     body_material_id: lineItem.bodyMaterialId,
  //     repair_type_id: lineItem.repairTypeId,
  //     impact_count_25: lineItem.impactCount25,
  //     impact_count_35: lineItem.impactCount35,
  //     dent_removal_price: lineItem.strippingPercentage,
  //     price: lineItem.price,
  //   };

  //   const { error } = await this.clientProvider.getClient()
  //     .fromSchema<'quoting', 'invoice_details'>('quoting', 'invoice_details')
  //     .insert(lineApi);

  //   if (error) throw new Error('Error adding invoice detail');
  // }

  // async updateLineItem(invoiceId: string, lineItem: InvoiceLineItemDto): Promise<void> {
  //   const lineApi: InvoiceDetailApiModel = {
  //     id: lineItem.id,
  //     invoice_id: invoiceId,
  //     body_part_id: lineItem.bodyPartId,
  //     body_material_id: lineItem.bodyMaterialId,
  //     repair_type_id: lineItem.repairTypeId,
  //     impact_count_25: lineItem.impactCount25,
  //     impact_count_35: lineItem.impactCount35,
  //     dent_removal_price: lineItem.strippingPercentage,
  //     price: lineItem.price,
  //   };

  //   const { error } = await this.clientProvider.getClient()
  //     .fromSchema<'quoting', 'invoice_details'>('quoting', 'invoice_details')
  //     .update(lineApi)
  //     .eq('id', lineApi.id);

  //   if (error) throw new Error('Error updating invoice detail');
  // }

  async updateStatus(invoiceId: string, statusId: string): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .from('invoices')
      .update({ status_id: statusId })
      .eq('id', invoiceId);

    if (error) throw new Error('Error updating invoice status');
  }

  async markAsSent(invoiceId: string): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .from('invoices')
      .update({ is_sent: true, sent_at: new Date().toISOString() })
      .eq('id', invoiceId);

    if (error) throw new Error(`Error marking invoice as sent: ${error.message}`);
  }

  async getByTechnicianId(technicianId: string): Promise<InvoiceDto[]> {
    const { data: memberData } = await this.clientProvider.getClient()
      .from('organization_members')
      .select('id')
      .eq('user_id', technicianId)
      .maybeSingle<{ id: string }>();

    if (!memberData?.id) return [];

    const { data, error } = await this.clientProvider.getClient()
      .from('invoices')
      .select(`
        *,
        status:document_statuses(*)
      `)
      .or(`assigned_member_id.eq.${memberData.id},created_by_member_id.eq.${memberData.id}`)
      .returns<InvoiceApiModel[]>();

    if (error) throw new Error('Error fetching invoices by technician');
    return data.map(InvoiceMapper.apiToDto);
  }

  async updateCommission(invoiceId: string, commissionRate: number | null, commissionPaid: boolean): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .from('invoices')
      .update({ commission_rate: commissionRate, commission_paid: commissionPaid })
      .eq('id', invoiceId);

    if (error) throw new Error('Error updating invoice commission');
  }
}
