// src/@infrastructure/database/repositories/settings/price/SettingPriceDiameterCoefficientRepository.ts
import { SettingPriceDiameterCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceDiameterCoefficientDto';
import { ISettingPriceDiameterCoefficientRepository } from '@/@domain/repositories/settings/price/ISettingPriceDiameterCoefficientRepository';
import { SettingPriceDiameterCoefficientApiModel } from '@/@infrastructure/database/api/settings/price/SettingPriceDiameterCoefficientApiModel';
import { SupabaseClient } from '@/@infrastructure/database/clients/SupabaseClient';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { SettingPriceDiameterCoefficientMapper } from '@/@infrastructure/mappers/settings/price/SettingPriceDiameterCoefficientMapper';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceDiameterCoefficientRepository implements ISettingPriceDiameterCoefficientRepository {
  constructor(@inject(SYMBOLS.Providers.ClientProvider) private clientProvider: IClientProvider<SupabaseClient>) {}

  async getByUserId(userId: string): Promise<SettingPriceDiameterCoefficientDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .fromSchema<'car_repair', 'setting_price_diameter_coefficient'>('car_repair', 'setting_price_diameter_coefficient')
      .select('*')
      .eq('user_id', userId)
      .returns<SettingPriceDiameterCoefficientApiModel[]>();

    if (error) throw new Error('Error fetching diameter coefficient settings');

    return data.map(SettingPriceDiameterCoefficientMapper.apiToDto);
  }

  async create(setting: SettingPriceDiameterCoefficientDto): Promise<SettingPriceDiameterCoefficientDto> {
    const settingApi = SettingPriceDiameterCoefficientMapper.dtoToApi(setting);

    const { data, error } = await this.clientProvider.getClient()
      .fromSchema<'car_repair', 'setting_price_diameter_coefficient'>('car_repair', 'setting_price_diameter_coefficient')
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
      .fromSchema<'car_repair', 'setting_price_diameter_coefficient'>('car_repair', 'setting_price_diameter_coefficient')
      .update(settingApi)
      .eq('id', settingApi.id)
      .single<SettingPriceDiameterCoefficientApiModel>();

    if (error) throw new Error('Error updating diameter coefficient setting');

    return SettingPriceDiameterCoefficientMapper.apiToDto(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .fromSchema<'car_repair', 'setting_price_diameter_coefficient'>('car_repair', 'setting_price_diameter_coefficient')
      .delete()
      .eq('id', id);

    if (error) throw new Error('Error deleting diameter coefficient setting');
  }
}
