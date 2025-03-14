// src/@infrastructure/database/repositories/settings/price/SettingPriceHourlyRateRepository.ts
import { SettingPriceDto } from '@/@application/dtos/settings/price/SettingPriceDto';
import { ISettingPriceRepository } from '@/@domain/repositories/settings/price/ISettingPriceRepository';
import { SettingPriceApiModel } from '@/@infrastructure/database/api/settings/price/SettingPriceApiModel';
import { SupabaseClient } from '@/@infrastructure/database/clients/SupabaseClient';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { SettingPriceMapper } from '@/@infrastructure/mappers/settings/price/SettingPriceMapper';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceRepository implements ISettingPriceRepository {
  constructor(@inject(SYMBOLS.Providers.ClientProvider) private clientProvider: IClientProvider<SupabaseClient>) {}

  async getByUserId(userId: string): Promise<SettingPriceDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .fromSchema<'car_repair', 'setting_price_general'>('car_repair', 'setting_price_general')
      .select('*')
      .eq('user_id', userId)
      .returns<SettingPriceApiModel[]>();

    if (error) throw new Error('Error fetching general settings');

    return data.map(SettingPriceMapper.apiToDto);
  }
}
