import { IQuoteDetailRepository } from '@/features/quotes/application/ports/repositories/IQuoteDetailRepository';
import { LineItemApiModel } from '@/features/lineItems/infrastructure/api/LineItemApiModel';
import { LineItemDto } from '@/features/lineItems/application/dtos/LineItemDto';
import { IClientProvider } from '@/shared/infrastructure/supabase/IClientProvider';
import { LineItemMapper } from '@/features/lineItems/infrastructure/mappers/LineItemMapper';
import { SupabaseClient } from '@supabase/supabase-js';

export class QuoteDetailRepository implements IQuoteDetailRepository {
  constructor(private clientProvider: IClientProvider<SupabaseClient>) {}

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
      

    if (error) throw new Error('Error fetching quote detail');
    return data.map(LineItemMapper.apiToDto);
  }

  async insert(item: LineItemDto): Promise<LineItemDto> {
    const { data, error } = await this.clientProvider.getClient()
      .from('quote_details')
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
      throw new Error('Error inserting quote detail');
    
    return LineItemMapper.apiToDto(data[0]);
  }

  async update(items: LineItemDto[]): Promise<LineItemDto[]> {
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
