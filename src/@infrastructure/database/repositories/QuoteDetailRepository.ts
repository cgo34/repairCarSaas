import { IQuoteDetailRepository } from '@/@domain/repositories/IQuoteDetailRepository';
import { LineItemApiModel } from '@/@infrastructure/database/api/LineItemApiModel';
import { LineItemDto } from '@/@infrastructure/dtos/LineItemDto';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { LineItemMapper } from '@/@infrastructure/mappers/LineItemMapper';
import { SupabaseClient } from '@supabase/supabase-js';
import { inject, injectable } from 'inversify';

@injectable()
export class QuoteDetailRepository implements IQuoteDetailRepository {
  constructor(@inject(SYMBOLS.Providers.ClientProvider) private clientProvider: IClientProvider<SupabaseClient>) {}

  async getAllByQuoteId(quoteId: string): Promise<LineItemDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .from('quote_details')
      .select('*')
      .eq('quote_id', quoteId)
      .returns<LineItemApiModel[]>();

    if (error) throw new Error('Error fetching quote details');
    return data.map(LineItemMapper.apiToDto);
  }

  async get(id: string): Promise<LineItemDto[] | null> {
    const { data, error } = await this.clientProvider.getClient()
      .from('quote_details')
      .select(`
        *,
        bodyPart:body_parts(*),
        bodyMaterial:body_materials(*),
        repairType:repair_types(*)
      `)
      .eq('quote_id', id)
      .returns<LineItemApiModel[]>();
      console.log('get quote detail', data);
      

    if (error) throw new Error('Error fetching quote detail');
    return data.map(LineItemMapper.apiToDto);
  }

  async insert(items: LineItemDto[]): Promise<void> {
    console.log('insert items', items);
    
    const { data, error } = await this.clientProvider.getClient()
      .from('quote_details')
      .insert(items.map(LineItemMapper.dtoToApi))
      .select('*') // si tu veux les lignes insérées
      .returns<LineItemApiModel[]>();
    ;

    if (error)
      throw new Error('Error inserting quote detail');
    // return data.map(LineItemMapper.apiToDto);
  }

  async update(items: LineItemDto[]): Promise<LineItemDto> {
    const { data, error } = await this.clientProvider.getClient()
      .from('quote_details')
      .update(items.map(LineItemMapper.dtoToApi))
      .eq('quote_id', items[0].quoteId)
      .select('*')
      .returns<LineItemApiModel[]>();

    if (error)
      throw new Error('Error updating quote detail');

    return data.map(LineItemMapper.apiToDto);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .from('quote_details')
      .delete()
      .eq('id', id);

    if (error) throw new Error('Error deleting quote detail');
  }
}
