import { IInvoiceRepository } from '@/@domain/repositories/IInvoiceRepository';
import { InvoiceApiModel } from '@/@infrastructure/database/api/InvoiceApiModel';
import { SupabaseClient } from '@/@infrastructure/database/clients/SupabaseClient';
import { InvoiceDto } from '@/@application/dtos/InvoiceDto';
import { InvoiceStatusDto } from '@/@infrastructure/dtos/InvoiceStatusDto';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { InvoiceMapper } from '@/@infrastructure/mappers/InvoiceMapper';
import { inject, injectable } from 'inversify';

@injectable()
export class InvoiceRepository implements IInvoiceRepository {
  constructor(@inject(SYMBOLS.Providers.ClientProvider) private clientProvider: IClientProvider<SupabaseClient>) {}

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

    console.log('Creating invoice with API model:', invoiceApi);

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
        technician:users!invoices_technician_id_fkey(*),
        garage:garages(*)
      `)
      .returns<any[]>();

    if (error)
      throw new Error('Error updating invoice');

    return InvoiceMapper.apiToDto(data?.[0] ?? {});
  }

  /**
   * Supprime un devis.
   */
  async delete(id: string): Promise<void> {
    const { errorDetails } = await this.clientProvider.getClient()
      .from('invoice_details')
      .delete()
      .eq('invoice_id', id);

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

  async updateStatus(invoiceId: string, status: InvoiceStatusDto): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .fromSchema<'quoting', 'invoices'>('quoting', 'invoices')
      .update({ status: status.status })
      .eq('id', invoiceId);

    if (error) throw new Error('Error updating invoice status');
  }
}
