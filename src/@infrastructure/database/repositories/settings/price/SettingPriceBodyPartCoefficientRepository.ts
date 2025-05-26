// src/@infrastructure/database/repositories/settings/price/SettingPriceBodyPartCoefficientRepository.ts
import { ISettingPriceBodyPartCoefficientRepository } from '@/@domain/repositories/settings/price/ISettingPriceBodyPartCoefficientRepository';
import { SettingPriceBodyPartCoefficientApiModel } from '@/@infrastructure/database/api/settings/price/SettingPriceBodyPartCoefficientApiModel';
import { SupabaseClient } from '@/@infrastructure/database/clients/SupabaseClient';
import { SettingPriceBodyPartCoefficientDto } from '@/@infrastructure/dtos/settings/price/SettingPriceBodyPartCoefficientDto';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { SettingPriceBodyPartCoefficientMapper } from '@/@infrastructure/mappers/settings/price/SettingPriceBodyPartCoefficientMapper';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceBodyPartCoefficientRepository implements ISettingPriceBodyPartCoefficientRepository {
  constructor(@inject(SYMBOLS.Providers.ClientProvider) private clientProvider: IClientProvider<SupabaseClient>) {}
  
    async getAdmin(): Promise<SettingPriceBodyPartCoefficientDto[]> {
      console.log('repository getAdmin');
      
      const { data, error } = await this.clientProvider.getClient()
        .from('setting_price_body_part_coefficient')
        .select(`
          *,
          body_parts(*),
          users (
            id,
            role
          )
        `)
        .eq('users.role', 'admin')
        .returns<SettingPriceBodyPartCoefficientDto[]>();
  
      if (error)
        throw new Error('Error fetching body part coefficient settings');

      console.log('data', data);
      
  
      return data.map(SettingPriceBodyPartCoefficientMapper.apiToDto);
    }

  async getByUserId(userId: string): Promise<SettingPriceBodyPartCoefficientDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_body_part_coefficient')
      .select('*, body_parts(*)')
      .eq('user_id', userId)
      .returns<SettingPriceBodyPartCoefficientApiModel[]>();

    if (error) throw new Error('Error fetching body part coefficient settings');

    return data.map(SettingPriceBodyPartCoefficientMapper.apiToDto);
  }
    
  async save(settings: SettingPriceBodyPartCoefficientApiModel[]): Promise<SettingPriceBodyPartCoefficientApiModel[]> {
    const settingsApi = settings.map(s => SettingPriceBodyPartCoefficientMapper.dtoToApi(s));
    console.log('save settingApi', settingsApi);
    
    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_body_part_coefficient')
      .upsert(settingsApi, { onConflict: ['user_id, body_part_id'], defaultToNull: false })
      .select('*')
      .returns<SettingPriceBodyPartCoefficientApiModel[]>();

    if (error) throw new Error('Error saving general setting');

    return data.map(d => SettingPriceBodyPartCoefficientMapper.apiToDto(d));
  }

  async create(setting: SettingPriceBodyPartCoefficientDto): Promise<SettingPriceBodyPartCoefficientDto> {
    const settingApi = SettingPriceBodyPartCoefficientMapper.dtoToApi(setting);

    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_body_part_coefficient')
      .insert({
        difficulty_coefficient: settingApi.difficulty_coefficient,
        body_part_id: settingApi.body_parts?.id,
        user_id: settingApi.user_id
      })
      .select('*, body_parts(*)')
      .single<SettingPriceBodyPartCoefficientApiModel>();

    if (error) throw new Error('Error creating body part coefficient setting');

    return SettingPriceBodyPartCoefficientMapper.apiToDto(data);
  }

  async update(setting: SettingPriceBodyPartCoefficientDto): Promise<SettingPriceBodyPartCoefficientDto> {
    const settingApi = SettingPriceBodyPartCoefficientMapper.dtoToApi(setting);

    if (!settingApi.body_part_id) throw new Error('Setting ID is required');

    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_body_part_coefficient')
      .update({
        difficulty_coefficient: settingApi.difficulty_coefficient,
        body_part_id: settingApi.body_parts?.id,
        user_id: settingApi.user_id
      })
      .eq('body_part_id', settingApi.body_part_id)
      .eq('user_id', settingApi.user_id)
      .select('*, body_parts(*)')
      .single<SettingPriceBodyPartCoefficientApiModel>();

    if (error) throw new Error('Error updating body part coefficient setting');

    return SettingPriceBodyPartCoefficientMapper.apiToDto(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .from('setting_price_body_part_coefficient')
      .delete()
      .eq('id', id);

    if (error) throw new Error('Error deleting body part coefficient setting');
  }
}
