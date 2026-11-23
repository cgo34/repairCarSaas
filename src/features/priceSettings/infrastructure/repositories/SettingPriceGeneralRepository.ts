// src/@infrastructure/database/repositories/settings/price/SettingPriceHourlyRateRepository.ts
import { ISettingPriceGeneralRepository } from '@/features/priceSettings/application/ports/repositories/ISettingPriceGeneralRepository';
import { SettingPriceGeneralApiModel } from '@/features/priceSettings/infrastructure/api/SettingPriceGeneralApiModel';
import { SupabaseClient } from '@/shared/infrastructure/supabase/SupabaseClient';
import { SettingPriceGeneralDto } from '@/features/priceSettings/application/dtos/SettingPriceGeneralDto';
import { IClientProvider } from '@/shared/infrastructure/supabase/IClientProvider';
import { SettingPriceGeneralMapper } from '@/features/priceSettings/infrastructure/mappers/SettingPriceGeneralMapper';

export class SettingPriceGeneralRepository implements ISettingPriceGeneralRepository {
  constructor(private clientProvider: IClientProvider<SupabaseClient>) {}
  
  async getDefault(): Promise<SettingPriceGeneralDto> {
    const { data, error } = await this.clientProvider.getClient()
      .from('default_setting_price_general')
      .select('*')
      .maybeSingle<SettingPriceGeneralApiModel>();

    if (error) throw new Error('Error fetching default general settings');
    if (!data) throw new Error('No default general settings found');

    return SettingPriceGeneralMapper.apiToDto(data);
  }

  async getByOrganizationId(organizationId: string): Promise<SettingPriceGeneralDto | null> {
    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_general')
      .select('*')
      .eq('organization_id', organizationId)
      .maybeSingle<SettingPriceGeneralApiModel>();

    if (error) throw new Error('Error fetching general settings');

    return data ? SettingPriceGeneralMapper.apiToDto(data) : null;
  }

  async save(setting: SettingPriceGeneralDto): Promise<SettingPriceGeneralDto> {
    const settingApi = SettingPriceGeneralMapper.dtoToApi(setting);
    
    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_general')
      .upsert(settingApi)
      .select('*')
      .single<SettingPriceGeneralApiModel>();

    if (error) throw new Error('Error saving general setting');

    return SettingPriceGeneralMapper.apiToDto(data);
  }

  async create(setting: SettingPriceGeneralDto): Promise<SettingPriceGeneralDto> {
    const settingApi = SettingPriceGeneralMapper.dtoToApi(setting);
    
    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_general')
      .insert(settingApi)
      .select('*')
      .single<SettingPriceGeneralApiModel>();

    if (error) throw new Error('Error creating general setting');

    return SettingPriceGeneralMapper.apiToDto(data);
  }

  async update(setting: SettingPriceGeneralDto): Promise<SettingPriceGeneralDto> {
    const settingApi = SettingPriceGeneralMapper.dtoToApi(setting);

    if (!settingApi.id) throw new Error('Setting ID is required');

    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_general')
      .update(settingApi)
      .eq('id', settingApi.id)
      .select('*')
      .single<SettingPriceGeneralApiModel>();

    if (error) throw new Error('Error updating general setting');

    return SettingPriceGeneralMapper.apiToDto(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .from('setting_price_general')
      .delete()
      .eq('id', id);

    if (error) throw new Error('Error deleting general setting');
  }
}
