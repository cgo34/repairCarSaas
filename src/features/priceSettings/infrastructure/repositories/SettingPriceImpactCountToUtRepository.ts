import { ISettingPriceImpactCountToUtRepository } from '@/features/priceSettings/application/ports/repositories/ISettingPriceImpactCountToUtRepository';
import { SettingPriceImpactCountToUtApiModel } from '@/features/priceSettings/infrastructure/api/SettingPriceImpactCountToUtApiModel';
import { SupabaseClient } from '@/shared/infrastructure/supabase/SupabaseClient';
import { SettingPriceImpactCountToUtDto } from '@/features/priceSettings/application/dtos/SettingPriceImpactCountToUtDto';
import { IClientProvider } from '@/shared/infrastructure/supabase/IClientProvider';
import { SettingPriceImpactCountToUtMapper } from '@/features/priceSettings/infrastructure/mappers/SettingPriceImpactCountToUtMapper';

export class SettingPriceImpactCountToUtRepository implements ISettingPriceImpactCountToUtRepository {
  constructor(private clientProvider: IClientProvider<SupabaseClient>) {}

  async getDefault(): Promise<SettingPriceImpactCountToUtDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .from('default_setting_price_impact_count_to_ut')
      .select('*')
      .returns<SettingPriceImpactCountToUtApiModel[]>();

    if (error)
      throw new Error('Error fetching impact count to UT settings');

    return data.map(SettingPriceImpactCountToUtMapper.apiToDto);
  }

  async getByOrganizationId(organizationId: string): Promise<SettingPriceImpactCountToUtDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_impact_count_to_ut')
      .select('*')
      .eq('organization_id', organizationId)
      .order('impact_count_min', { ascending: true })
      .returns<SettingPriceImpactCountToUtApiModel[]>();

    if (error)
      throw new Error('Error fetching impact count to UT settings');

    return data.map(SettingPriceImpactCountToUtMapper.apiToDto);
  }
  
  async save(settings: SettingPriceImpactCountToUtDto[]): Promise<SettingPriceImpactCountToUtDto[]> {
    const settingsApi = settings.map(s => SettingPriceImpactCountToUtMapper.dtoToApi(s));
    
    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_impact_count_to_ut')
      .upsert(settingsApi, { onConflict: 'id', defaultToNull: false })
      .select('*')
      .returns<SettingPriceImpactCountToUtApiModel[]>();

    if (error) throw new Error('Error saving general setting');

    return data.map(d => SettingPriceImpactCountToUtMapper.apiToDto(d));
  }

  async create(setting: SettingPriceImpactCountToUtDto): Promise<SettingPriceImpactCountToUtDto> {
    const apiModel = SettingPriceImpactCountToUtMapper.dtoToApi(setting);
    apiModel.id = apiModel.id ?? crypto.randomUUID();

    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_impact_count_to_ut')
      .insert(apiModel)
      .select('*')
      .single<SettingPriceImpactCountToUtApiModel>();

    if (error) {
      console.error('[ImpactCountToUtRepo] create error:', error);
      throw new Error('Error creating impact count to UT setting');
    }

    return SettingPriceImpactCountToUtMapper.apiToDto(data);
  }

  async update(setting: SettingPriceImpactCountToUtDto): Promise<SettingPriceImpactCountToUtDto> {
    const apiModel = SettingPriceImpactCountToUtMapper.dtoToApi(setting);

    if (!apiModel.id)
      throw new Error('Setting ID is required');

    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_impact_count_to_ut')
      .update(apiModel)
      .eq('id', apiModel.id)
      .eq('organization_id', apiModel.organization_id)
      .select('*')
      .single<SettingPriceImpactCountToUtApiModel>();

    if (error)
      throw new Error('Error updating impact count to UT setting');

    return SettingPriceImpactCountToUtMapper.apiToDto(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .from('setting_price_impact_count_to_ut')
      .delete()
      .eq('id', id);

    if (error)
      throw new Error('Error deleting impact count to UT setting');
  }
}
