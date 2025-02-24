// src/@infrastructure/database/repositories/settings/price/SettingPriceHourlyRateRepository.ts
import { SettingPriceGeneralDto } from '@/@application/dtos/settings/price/SettingPriceGeneralDto';
import { ISettingPriceGeneralRepository } from '@/@domain/repositories/settings/price/ISettingPriceGeneralRepository';
import { SettingPriceGeneralApiModel } from '@/@infrastructure/database/api/settings/price/SettingPriceGeneralApiModel';
import { SupabaseClient } from '@/@infrastructure/database/clients/SupabaseClient';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { SettingPriceGeneralMapper } from '@/@infrastructure/mappers/settings/price/SettingPriceGeneralMapper';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceGeneralRepository implements ISettingPriceGeneralRepository {
  constructor(@inject(SYMBOLS.Providers.ClientProvider) private clientProvider: IClientProvider<SupabaseClient>) {}

  async getByUserId(userId: string): Promise<SettingPriceGeneralDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .fromSchema<'car_repair', 'setting_price_general'>('car_repair', 'setting_price_general')
      .select('*')
      .eq('user_id', userId)
      .returns<SettingPriceGeneralApiModel[]>();

    if (error) throw new Error('Error fetching general settings');

    return data.map(SettingPriceGeneralMapper.apiToDto);
  }

  async create(setting: SettingPriceGeneralDto): Promise<SettingPriceGeneralDto> {
    const settingApi = SettingPriceGeneralMapper.dtoToApi(setting);
    console.log(settingApi);
    
    const { data, error } = await this.clientProvider.getClient()
      .fromSchema<'car_repair', 'setting_price_general'>('car_repair', 'setting_price_general')
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
      .fromSchema<'car_repair', 'setting_price_general'>('car_repair', 'setting_price_general')
      .update(settingApi)
      .eq('id', settingApi.id)
      .single<SettingPriceGeneralApiModel>();

    if (error) throw new Error('Error updating general setting');

    return SettingPriceGeneralMapper.apiToDto(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .fromSchema<'car_repair', 'setting_price_general'>('car_repair', 'setting_price_general')
      .delete()
      .eq('id', id);

    if (error) throw new Error('Error deleting general setting');
  }
}
