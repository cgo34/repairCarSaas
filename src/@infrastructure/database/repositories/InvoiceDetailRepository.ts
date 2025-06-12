import { IInvoiceDetailRepository } from '@/@domain/repositories/IInvoiceDetailRepository';
import { LineItemApiModel } from '@/@infrastructure/database/api/LineItemApiModel';
import { LineItemDto } from '@/@infrastructure/dtos/LineItemDto';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { LineItemMapper } from '@/@infrastructure/mappers/LineItemMapper';
import { SupabaseClient } from '@supabase/supabase-js';
import { inject, injectable } from 'inversify';

@injectable()
export class InvoiceDetailRepository implements IInvoiceDetailRepository {
  constructor(@inject(SYMBOLS.Providers.ClientProvider) private clientProvider: IClientProvider<SupabaseClient>) {}

  async getAllByInvoiceId(invoiceId: string): Promise<LineItemDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .from('invoice_details')
      .select('*')
      .eq('invoice_id', invoiceId)
      .returns<LineItemApiModel[]>();

    if (error) throw new Error('Error fetching invoice details');
    return data.map(LineItemMapper.apiToDto);
  }

  async get(id: string): Promise<LineItemDto[] | null> {
    const { data, error } = await this.clientProvider.getClient()
      .from('invoice_details')
      .select(`
        *,
        bodyPart:body_parts(*),
        bodyMaterial:body_materials(*),
        repairType:repair_types(*)
      `)
      .eq('invoice_id', id)
      .returns<LineItemApiModel[]>();
      

    if (error) throw new Error('Error fetching invoice detail');
    return data.map(LineItemMapper.apiToDto);
  }

  async insert(item: LineItemDto): Promise<LineItemDto> {
    
    const { data, error } = await this.clientProvider.getClient()
      .from('invoice_details')
      .insert(LineItemMapper.dtoToApi(item))
      .select(`
        *,
        bodyPart:body_parts(*),
        bodyMaterial:body_materials(*),
        repairType:repair_types(*)
      `) // si tu veux les lignes insérées
      .returns<LineItemApiModel[]>();
    ;

    if (error)
      throw new Error('Error inserting invoice detail');
    
    return LineItemMapper.apiToDto(data[0]);
  }

  

  async insertMultiple(items: LineItemDto[]): Promise<LineItemDto[]> {
    
    const { data, error } = await this.clientProvider.getClient()
      .from('invoice_details')
      .insert(items.map(LineItemMapper.invoiceDtoToApi))
      .select(`
        *,
        bodyPart:body_parts(*),
        bodyMaterial:body_materials(*),
        repairType:repair_types(*)
      `) // si tu veux les lignes insérées
      .returns<LineItemApiModel[]>();
    ;

    if (error)
      throw new Error('Error inserting invoice detail');
    
    return data;
  }

  async update(items: LineItemDto[]): Promise<LineItemDto> {
    const { data, error } = await this.clientProvider.getClient()
      .from('invoice_details')
      .update(items.map(LineItemMapper.dtoToApi))
      .eq('invoice_id', items[0].invoiceId)
      .select('*')
      .returns<LineItemApiModel[]>();

    if (error)
      throw new Error('Error updating invoice detail');

    return data.map(LineItemMapper.apiToDto);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .from('invoice_details')
      .delete()
      .eq('id', id);

    if (error) throw new Error('Error deleting invoice detail');
  }
}
