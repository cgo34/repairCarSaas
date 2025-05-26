// src/@infrastructure/database/repositories/settings/price/SettingPriceTechnicityCoefficientRepository.ts
import { ISettingPriceTechnicityCoefficientRepository } from '@/@domain/repositories/settings/price/ISettingPriceTechnicityCoefficientRepository';
import { SettingPriceTechnicityCoefficientApiModel } from '@/@infrastructure/database/api/settings/price/SettingPriceTechnicityCoefficientApiModel';
import { SupabaseClient } from '@/@infrastructure/database/clients/SupabaseClient';
import { SettingPriceTechnicityCoefficientDto } from '@/@infrastructure/dtos/settings/price/SettingPriceTechnicityCoefficientDto';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { SettingPriceTechnicityCoefficientMapper } from '@/@infrastructure/mappers/settings/price/SettingPriceTechnicityCoefficientMapper';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceTechnicityCoefficientRepository implements ISettingPriceTechnicityCoefficientRepository {
  constructor(@inject(SYMBOLS.Providers.ClientProvider) private clientProvider: IClientProvider<SupabaseClient>) {}
    
  async getAdmin(): Promise<SettingPriceTechnicityCoefficientDto> {
    console.log('repository SettingPriceTechnicityCoefficientRepository getAdmin');
    
    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_technicity_coefficient')
      .select(`
        *,
        users (
          id,
          role
        )
      `)
      .eq('users.role', 'admin')
      .limit(1)
      .single<SettingPriceTechnicityCoefficientApiModel>();

    if (error)
      throw new Error('Error fetching technicity coefficient settings');
    console.log(data);
    
    return SettingPriceTechnicityCoefficientMapper.apiToDto(data);
  }

  async getByUserId(userId: string): Promise<SettingPriceTechnicityCoefficientDto | null> {
    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_technicity_coefficient')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle<SettingPriceTechnicityCoefficientApiModel>();

    if (error) throw new Error('Error fetching technicity coefficient settings');

    return data ? SettingPriceTechnicityCoefficientMapper.apiToDto(data) : null;
  }

  async save(setting: SettingPriceTechnicityCoefficientDto): Promise<SettingPriceTechnicityCoefficientDto> {
    const settingApi = SettingPriceTechnicityCoefficientMapper.dtoToApi(setting);
    console.log('save settingApi', settingApi);
    
    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_technicity_coefficient')
      .upsert(settingApi)
      .select('*')
      .single<SettingPriceTechnicityCoefficientApiModel>();

    if (error) throw new Error('Error saving general setting');

    return SettingPriceTechnicityCoefficientMapper.apiToDto(data);
  }

  async create(setting: SettingPriceTechnicityCoefficientDto): Promise<SettingPriceTechnicityCoefficientDto> {
    const settingApi = SettingPriceTechnicityCoefficientMapper.dtoToApi(setting);

    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_technicity_coefficient')
      .insert(settingApi)
      .select('*')
      .single<SettingPriceTechnicityCoefficientApiModel>();

    if (error) throw new Error('Error creating technicity coefficient setting');

    return SettingPriceTechnicityCoefficientMapper.apiToDto(data);
  }

  async update(setting: SettingPriceTechnicityCoefficientDto): Promise<SettingPriceTechnicityCoefficientDto> {
    const settingApi = SettingPriceTechnicityCoefficientMapper.dtoToApi(setting);

    if (!settingApi.id) throw new Error('Setting ID is required');

    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_technicity_coefficient')
      .update(settingApi)
      .eq('id', settingApi.id)
      .eq('user_id', settingApi.user_id)
      .select('*')
      .single<SettingPriceTechnicityCoefficientApiModel>();

    if (error) throw new Error('Error updating technicity coefficient setting');

    return SettingPriceTechnicityCoefficientMapper.apiToDto(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .from('setting_price_technicity_coefficient')
      .delete()
      .eq('id', id);

    if (error) throw new Error('Error deleting technicity coefficient setting');
  }
}
