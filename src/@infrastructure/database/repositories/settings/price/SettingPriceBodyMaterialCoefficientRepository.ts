// src/@infrastructure/database/repositories/settings/price/SettingPriceBodyMaterialCoefficientRepository.ts
import { ISettingPriceBodyMaterialCoefficientRepository } from '@/@domain/repositories/settings/price/ISettingPriceBodyMaterialCoefficientRepository';
import { SettingPriceBodyMaterialCoefficientApiModel } from '@/@infrastructure/database/api/settings/price/SettingPriceBodyMaterialCoefficientApiModel';
import { SupabaseClient } from '@/@infrastructure/database/clients/SupabaseClient';
import { SettingPriceBodyMaterialCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceBodyMaterialCoefficientDto';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { SettingPriceBodyMaterialCoefficientMapper } from '@/@infrastructure/mappers/settings/price/SettingPriceBodyMaterialCoefficientMapper';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceBodyMaterialCoefficientRepository implements ISettingPriceBodyMaterialCoefficientRepository {
  constructor(@inject(SYMBOLS.Providers.ClientProvider) private clientProvider: IClientProvider<SupabaseClient>) {}

  async getByUserId(userId: string): Promise<SettingPriceBodyMaterialCoefficientDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_body_material_coefficient')
      .select('*, body_materials(*)')
      .eq('user_id', userId)
      .returns<SettingPriceBodyMaterialCoefficientApiModel[]>();

    if (error) throw new Error('Error fetching body material coefficient settings');

    return data.map(SettingPriceBodyMaterialCoefficientMapper.apiToDto);
  }

  async create(setting: SettingPriceBodyMaterialCoefficientDto): Promise<SettingPriceBodyMaterialCoefficientDto> {
    const settingApi = SettingPriceBodyMaterialCoefficientMapper.dtoToApi(setting);

    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_body_material_coefficient')
      .insert({
        material_coefficient: settingApi.material_coefficient,
        body_material_id: settingApi.body_materials?.id,
        user_id: settingApi.user_id
      })
      .select('*, body_materials(*)')
      .single<SettingPriceBodyMaterialCoefficientApiModel>();

    if (error) throw new Error('Error creating body material coefficient setting');

    return SettingPriceBodyMaterialCoefficientMapper.apiToDto(data);
  }

  async update(setting: SettingPriceBodyMaterialCoefficientDto): Promise<SettingPriceBodyMaterialCoefficientDto> {
    const settingApi = SettingPriceBodyMaterialCoefficientMapper.dtoToApi(setting);

    if (!settingApi.body_material_id) throw new Error('Setting ID is required');

    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_body_material_coefficient')
      .update({
        material_coefficient: settingApi.material_coefficient,
        body_material_id: settingApi.body_materials?.id,
        user_id: settingApi.user_id
      })
      .eq('body_material_id', settingApi.body_material_id)
      .eq('user_id', settingApi.user_id)
      .select('*, body_materials(*)')
      .single<SettingPriceBodyMaterialCoefficientApiModel>();

    if (error) throw new Error('Error updating body material coefficient setting');

    return SettingPriceBodyMaterialCoefficientMapper.apiToDto(data);
  }

  async delete(bodyMaterialId: string, userId: string): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .from('setting_price_body_material_coefficient')
      .delete()
      .eq('body_material_id', bodyMaterialId)
      .eq('user_id', userId);

    if (error) throw new Error('Error deleting body material coefficient setting');
  }
}
