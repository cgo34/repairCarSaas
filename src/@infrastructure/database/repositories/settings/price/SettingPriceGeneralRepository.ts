// src/@infrastructure/database/repositories/settings/price/SettingPriceHourlyRateRepository.ts
import { ISettingPriceGeneralRepository } from '@/@domain/repositories/settings/price/ISettingPriceGeneralRepository';
import { SettingPriceGeneralApiModel } from '@/@infrastructure/database/api/settings/price/SettingPriceGeneralApiModel';
import { SupabaseClient } from '@/@infrastructure/database/clients/SupabaseClient';
import { DEFAULT_SETTINGS_USER_ID } from '@/@infrastructure/database/helpers/getAdminUserIdWithSettings';
import { SettingPriceGeneralDto } from '@/@application/dtos/settings/price/SettingPriceGeneralDto';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { SettingPriceGeneralMapper } from '@/@infrastructure/mappers/settings/price/SettingPriceGeneralMapper';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceGeneralRepository implements ISettingPriceGeneralRepository {
  constructor(@inject(SYMBOLS.Providers.ClientProvider) private clientProvider: IClientProvider<SupabaseClient>) {}
  
  async getAdmin(): Promise<SettingPriceGeneralDto> {
    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_general')
      .select('*')
      .eq('user_id', DEFAULT_SETTINGS_USER_ID)
      .maybeSingle<SettingPriceGeneralApiModel>();

    if (error) throw new Error('Error fetching default general settings');
    if (!data) throw new Error('No default general settings found');

    return SettingPriceGeneralMapper.apiToDto(data);
  }

  async getByUserId(userId: string): Promise<SettingPriceGeneralDto | null> {
    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_general')
      .select('*')
      .eq('user_id', userId)
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
