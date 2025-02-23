// src/@infrastructure/database/repositories/settings/price/SettingPriceBodyPartCoefficientRepository.ts
import { SettingPriceBodyPartCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceBodyPartCoefficientDto';
import { ISettingPriceBodyPartCoefficientRepository } from '@/@domain/repositories/settings/price/ISettingPriceBodyPartCoefficientRepository';
import { SettingPriceBodyPartCoefficientApiModel } from '@/@infrastructure/database/api/settings/price/SettingPriceBodyPartCoefficientApiModel';
import { SupabaseClient } from '@/@infrastructure/database/clients/SupabaseClient';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { SettingPriceBodyPartCoefficientMapper } from '@/@infrastructure/mappers/settings/price/SettingPriceBodyPartCoefficientMapper';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceBodyPartCoefficientRepository implements ISettingPriceBodyPartCoefficientRepository {
  constructor(@inject(SYMBOLS.Providers.ClientProvider) private clientProvider: IClientProvider<SupabaseClient>) {}

  async getByUserId(userId: string): Promise<SettingPriceBodyPartCoefficientDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .fromSchema<'car_repair', 'setting_price_body_part_coefficient'>('car_repair', 'setting_price_body_part_coefficient')
      .select('*')
      .eq('user_id', userId)
      .returns<SettingPriceBodyPartCoefficientApiModel[]>();

    if (error) throw new Error('Error fetching body part coefficient settings');

    return data.map(SettingPriceBodyPartCoefficientMapper.apiToDto);
  }

  async create(setting: SettingPriceBodyPartCoefficientDto): Promise<SettingPriceBodyPartCoefficientDto> {
    const settingApi = SettingPriceBodyPartCoefficientMapper.dtoToApi(setting);

    const { data, error } = await this.clientProvider.getClient()
      .fromSchema<'car_repair', 'setting_price_body_part_coefficient'>('car_repair', 'setting_price_body_part_coefficient')
      .insert(settingApi)
      .select('*')
      .single<SettingPriceBodyPartCoefficientApiModel>();

    if (error) throw new Error('Error creating body part coefficient setting');

    return SettingPriceBodyPartCoefficientMapper.apiToDto(data);
  }

  async update(setting: SettingPriceBodyPartCoefficientDto): Promise<SettingPriceBodyPartCoefficientDto> {
    const settingApi = SettingPriceBodyPartCoefficientMapper.dtoToApi(setting);

    if (!settingApi.id) throw new Error('Setting ID is required');

    const { data, error } = await this.clientProvider.getClient()
      .fromSchema<'car_repair', 'setting_price_body_part_coefficient'>('car_repair', 'setting_price_body_part_coefficient')
      .update(settingApi)
      .eq('id', settingApi.id)
      .single<SettingPriceBodyPartCoefficientApiModel>();

    if (error) throw new Error('Error updating body part coefficient setting');

    return SettingPriceBodyPartCoefficientMapper.apiToDto(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .fromSchema<'car_repair', 'setting_price_body_part_coefficient'>('car_repair', 'setting_price_body_part_coefficient')
      .delete()
      .eq('id', id);

    if (error) throw new Error('Error deleting body part coefficient setting');
  }
}
