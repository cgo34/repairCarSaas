// src/@infrastructure/database/repositories/settings/price/SettingPriceHourlyRateRepository.ts
import { ISettingPriceDiameterCoefficientRepository } from '@/features/priceSettings/application/ports/repositories/ISettingPriceDiameterCoefficientRepository';
import { SettingPriceDiameterCoefficientApiModel } from '@/features/priceSettings/infrastructure/api/SettingPriceDiameterCoefficientApiModel';
import { SupabaseClient } from '@/shared/infrastructure/supabase/SupabaseClient';
import { SettingPriceDiameterCoefficientDto } from '@/features/priceSettings/application/dtos/SettingPriceDiameterCoefficientDto';
import { IClientProvider } from '@/shared/infrastructure/supabase/IClientProvider';
import { SettingPriceDiameterCoefficientMapper } from '@/features/priceSettings/infrastructure/mappers/SettingPriceDiameterCoefficientMapper';

export class SettingPriceDiameterCoefficientRepository implements ISettingPriceDiameterCoefficientRepository {
  constructor(private clientProvider: IClientProvider<SupabaseClient>) {}
  
  async getDefault(): Promise<SettingPriceDiameterCoefficientDto> {
    const { data, error } = await this.clientProvider.getClient()
      .from('default_setting_price_diameter_coefficient')
      .select('*')
      .maybeSingle<SettingPriceDiameterCoefficientApiModel>();

    if (error) throw new Error('Error fetching default diameter coefficient settings');
    if (!data) throw new Error('No default diameter coefficient settings found');

    return SettingPriceDiameterCoefficientMapper.apiToDto(data);
  }

  async getByOrganizationId(organizationId: string): Promise<SettingPriceDiameterCoefficientDto | null> {
    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_diameter_coefficient')
      .select('*')
      .eq('organization_id', organizationId)
      .maybeSingle<SettingPriceDiameterCoefficientApiModel>();

    if (error) throw new Error('Error fetching diameter coefficient settings');

    return data ? SettingPriceDiameterCoefficientMapper.apiToDto(data) : null;
  }

  async save(setting: SettingPriceDiameterCoefficientDto): Promise<SettingPriceDiameterCoefficientDto> {
    const settingApi = SettingPriceDiameterCoefficientMapper.dtoToApi(setting);
    
    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_diameter_coefficient')
      .upsert(settingApi)
      .select('*')
      .single<SettingPriceDiameterCoefficientApiModel>();

    if (error) throw new Error('Error saving diameter coefficient setting');

    return SettingPriceDiameterCoefficientMapper.apiToDto(data);
  }

  async create(setting: SettingPriceDiameterCoefficientDto): Promise<SettingPriceDiameterCoefficientDto> {
    const settingApi = SettingPriceDiameterCoefficientMapper.dtoToApi(setting);
    
    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_diameter_coefficient')
      .insert(settingApi)
      .select('*')
      .single<SettingPriceDiameterCoefficientApiModel>();

    if (error) throw new Error('Error creating diameter coefficient setting');

    return SettingPriceDiameterCoefficientMapper.apiToDto(data);
  }

  async update(setting: SettingPriceDiameterCoefficientDto): Promise<SettingPriceDiameterCoefficientDto> {
    const settingApi = SettingPriceDiameterCoefficientMapper.dtoToApi(setting);

    if (!settingApi.id) throw new Error('Setting ID is required');

    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_diameter_coefficient')
      .update(settingApi)
      .eq('id', settingApi.id)
      .select('*')
      .single<SettingPriceDiameterCoefficientApiModel>();

    if (error) throw new Error('Error updating diameter coefficient setting');

    return SettingPriceDiameterCoefficientMapper.apiToDto(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .from('setting_price_diameter_coefficient')
      .delete()
      .eq('id', id);

    if (error) throw new Error('Error deleting general setting');
  }
}
