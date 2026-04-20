import { ISettingPriceImpactCountToUtRepository } from '@/@domain/repositories/settings/price/ISettingPriceImpactCountToUtRepository';
import { SettingPriceImpactCountToUtApiModel } from '@/@infrastructure/database/api/settings/price/SettingPriceImpactCountToUtApiModel';
import { SupabaseClient } from '@/@infrastructure/database/clients/SupabaseClient';
import { DEFAULT_SETTINGS_USER_ID } from '@/@infrastructure/database/helpers/getAdminUserIdWithSettings';
import { SettingPriceImpactCountToUtDto } from '@/@infrastructure/dtos/settings/price/SettingPriceImpactCountToUtDto';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { SettingPriceImpactCountToUtMapper } from '@/@infrastructure/mappers/settings/price/SettingPriceImpactCountToUtMapper';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceImpactCountToUtRepository implements ISettingPriceImpactCountToUtRepository {
  constructor(@inject(SYMBOLS.Providers.ClientProvider) private clientProvider: IClientProvider<SupabaseClient>) {}

  async getAdmin(): Promise<SettingPriceImpactCountToUtDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_impact_count_to_ut')
      .select('*')
      .eq('user_id', DEFAULT_SETTINGS_USER_ID)
      .returns<SettingPriceImpactCountToUtApiModel[]>();

    if (error)
      throw new Error('Error fetching impact count to UT settings');

    return data.map(SettingPriceImpactCountToUtMapper.apiToDto);
  }

  async getByUserId(userId: string): Promise<SettingPriceImpactCountToUtDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_impact_count_to_ut')
      .select('*')
      .eq('user_id', userId)
      .returns<SettingPriceImpactCountToUtApiModel[]>();

    if (error)
      throw new Error('Error fetching impact count to UT settings');

    return data.map(SettingPriceImpactCountToUtMapper.apiToDto);
  }
  
  async save(settings: SettingPriceImpactCountToUtDto[]): Promise<SettingPriceImpactCountToUtDto[]> {
    const settingsApi = settings.map(s => SettingPriceImpactCountToUtMapper.dtoToApi(s));
    
    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_impact_count_to_ut')
      .upsert(settingsApi, { onConflict: ['id'], defaultToNull: false })
      .select('*')
      .returns<SettingPriceImpactCountToUtApiModel[]>();

    if (error) throw new Error('Error saving general setting');

    return data.map(d => SettingPriceImpactCountToUtMapper.apiToDto(d));
  }

  async create(setting: SettingPriceImpactCountToUtDto): Promise<SettingPriceImpactCountToUtDto> {
    const apiModel = SettingPriceImpactCountToUtMapper.dtoToApi(setting);

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
      .eq('user_id', apiModel.user_id)
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
