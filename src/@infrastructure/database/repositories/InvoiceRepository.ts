import { IInvoiceRepository } from '@/@domain/repositories/IInvoiceRepository';
import { InvoiceApiModel } from '@/@infrastructure/database/api/InvoiceApiModel';
import { SupabaseClient } from '@/@infrastructure/database/clients/SupabaseClient';
import { InvoiceDto } from '@/@infrastructure/dtos/InvoiceDto';
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
  async generateInvoiceNumber(userId: string): Promise<string> {
    const { count, error } = await this.clientProvider.getClient()
    .from('invoices')
    .select('*', { count: 'exact', head: true }) // ⚡ Optimisé pour éviter un gros dataset
    .eq('user_id', userId)
    
    if (error)
      throw new Error('Error generating invoice number');

    const year = new Date().getFullYear().toString().slice(-2);
    const invoiceNumber = `F${year}${(count! + 1).toString().padStart(5, '0')}`;
    
    return invoiceNumber;
  }

  /**
   * Récupère tous les devis.
   */
  async getAll(): Promise<InvoiceDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .from('invoices')
      .select('*')
      .returns<InvoiceApiModel[]>();

    if (error)
      throw new Error('Error fetching invoices');

    return data.map(InvoiceMapper.apiToDto);
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
        status:document_statuses(*)
      `)
      .eq('user_id', userId)
      .returns<InvoiceApiModel[]>();

    if (error)
      throw new Error('Error fetching user invoices');

    return data.map(InvoiceMapper.apiToDto);
  }

  /**
   * Récupère un devis par ID.
   */
  async getById(id: string): Promise<InvoiceDto | null> {
    const { data, error } = await this.clientProvider.getClient()
      .from('invoices')
      .select(`
        *,
        technician:users!invoices_technician_id_fkey(*),
        garage:garages(*),
        status:document_statuses(*),
        quote:quotes(*)
      `)
      .eq('id', id)
      .single<InvoiceApiModel>();

    if (error)
      throw new Error('Error fetching invoice');

    return data ? InvoiceMapper.apiToDto(data) : null;
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
        user:users!invoices_user_id_fkey(*),
        technician:users!invoices_technician_id_fkey(*),
        garage:garages(*)
      `);

    if (error)
      throw new Error('Error updating invoice');

    return InvoiceMapper.apiToDto(data);
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
